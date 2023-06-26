set:
	#sed -i "s/_HOST=.*/_HOST=$(IP)/g" examples/**/env.ini
	sed -i "s/_host':.*/_host':'$(IP)',/g" examples/**/variables.py

publisher:
	mkdir -p generated/amot-publisher/
	rm -rf generated/amot-publisher/*
	mkdir -p generated/amot-publisher/components/

	cp amot.py generated/amot-publisher/
	cp agent.py generated/amot-publisher/
	
	cp examples/publisher/main.py generated/amot-publisher/main.py
	cp examples/publisher/app.py generated/amot-publisher/
	cp examples/publisher/variables.py generated/amot-publisher/
	cp examples/publisher/env.ini generated/amot-publisher/


subscriber:
	mkdir -p generated/amot-subscriber/
	rm -rf generated/amot-subscriber/*
	mkdir -p generated/amot-subscriber/components/

	cp amot.py generated/amot-subscriber/
	cp agent.py generated/amot-subscriber/
	
	cp examples/subscriber/main.py generated/amot-subscriber/
	cp examples/subscriber/app.py generated/amot-subscriber/
	cp examples/subscriber/variables.py generated/amot-subscriber/
	cp examples/subscriber/env.ini generated/amot-subscriber/


broker:
	mkdir -p generated/amot-broker/
	rm -rf generated/amot-broker/*
	mkdir -p generated/amot-broker/components/

	cp agent.py generated/amot-broker/
	cp amot.py generated/amot-broker/
	cp main.py generated/amot-broker/main.py

	cp MessageStorage.py generated/amot-broker/
	cp SubscriptionsManager.py generated/amot-broker/
	cp SubscriptionStorage.py generated/amot-broker/

	cp examples/broker/app.py generated/amot-broker/
	cp examples/broker/variables.py generated/amot-broker/


mqtt-publisher:
	mkdir -p generated/mqtt-publisher/
	rm -rf generated/mqtt-publisher/*
	mkdir -p generated/mqtt-publisher/components/

	cp agent.py generated/mqtt-publisher/
	cp amot.py generated/mqtt-publisher/

	cp examples/mqtt-publisher/app.py generated/mqtt-publisher/
	cp examples/mqtt-publisher/variables.py generated/mqtt-publisher/
	# cp examples/mqtt-publisher/env.ini generated/mqtt-publisher/
	cp examples/mqtt-publisher/main.py generated/mqtt-publisher/
	

mqtt-subscriber:
	mkdir -p generated/mqtt-subscriber/
	rm -rf generated/mqtt-subscriber/*
	mkdir -p generated/mqtt-subscriber/components/

	cp agent.py generated/mqtt-subscriber/
	cp amot.py generated/mqtt-subscriber/
	cp main.py generated/mqtt-subscriber/main.py

	cp examples/mqtt-subscriber/app.py generated/mqtt-subscriber/
	cp examples/mqtt-subscriber/variables.py generated/mqtt-subscriber/
	cp examples/mqtt-subscriber/main.py generated/mqtt-subscriber/


all:
	$(MAKE) broker
	$(MAKE) publisher
	$(MAKE) subscriber
	$(MAKE) mqtt-publisher
	$(MAKE) mqtt-subscriber


run-publisher:
	cd generated/amot-publisher && python3 main.py

run-subscriber:
	cd generated/amot-subscriber && python3 main.py

run-broker:
	cd generated/amot-broker && python3 main.py

run-mqtt-publisher:
	cd generated/mqtt-publisher && python3 main.py

run-mqtt-subscriber:
	cd generated/mqtt-subscriber && python3 main.py

run-coap-publisher:
	cd generated/coap-publisher && python3 main.py

run-coap-subscriber:
	cd generated/coap-subscriber && python3 main.py

run-thin-broker:
	cd generated/thin-broker && python3 main.py

run-thin-publisher:
	cd generated/thin-publisher && python3 main.py

run-thin-subscriber:
	cd generated/amot-subscriber && python3 main.py