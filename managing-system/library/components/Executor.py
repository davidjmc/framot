import sys

from AMoTEngine import AmotEngine

class Executor():
    def __init__(self):
        super().__init__()

    def run(self):
        has_adaptation = None

        adaptation = AmotEngine.adaptability['kind']
        thing_data = None
        if adaptation == b'Evolutive':
            comp_versions = b','.join(
                [
                    bytes('{0}:{1}'.format(comp,AmotEngine.components_versions[comp]), 'ascii') for comp in AmotEngine.components_versions.keys()
                ]
            )
            thing_data = AmotEngine.thing_id + b' ' + comp_versions

        if thing_data is None:
            return

        data = AmotEngine.attached(self).run(
            adaptation, thing_data, AmotEngine._server['host'],
            AmotEngine._server['port'])


        if not data or type(data) is not bytes:
            return

        data = str(data, 'utf-8')
        files = data.split('\x1c') # FILE SEPARATOR (28)
        for comp_content in files:
            compname_version, content = comp_content.split('\x1d') # GROUP SEPARATOR (29)
            compname, compversion = compname_version.split('#')
            self.adaptComponent(compname, compversion, content)

    def adaptComponent(self, component, version, data):
        print('===== adapting {0} ====='.format(component))
        file = component + '.py'
        wr = open(file, 'w')
        wr.write(data)
        wr.close()
        self.reloadComponent(component, version)

    # https://stackoverflow.com/questions/30379893/replacing-an-imported-module-dependency
    def reloadComponent(self, file, version):
        print(file, version)
        del sys.modules[file]
        module = __import__(file)
        sys.modules[file] = module
        AmotEngine.components_versions[file] = version
        fp = open('versions.txt', 'w')

        i = 0
        for _file in AmotEngine.components_versions.keys():
            data = ("\n" if i != 0 else "") + _file + '#' + AmotEngine.components_versions[_file]
            fp.write(data)
            i += 1
        fp.close()

        imported = __import__(file)
        imported.__dict__['AmotEngine'] = AmotEngine
        component_instance = getattr(imported, file)
        AmotEngine.current_components[file] = component_instance()
