import { Box, Divider, Image, Text, Title } from '@mantine/core';
import logo from '../../assets/logo.svg';

export const Home = () => {
  return (
    <Box
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image width="800px" src={logo} />
      <Divider
        color="#1A2F48"
        size="md"
        style={{ width: '800px' }}
        mt="md"
        mb="md"
      />
      <Title style={{ color: '#1A2F48' }}>Water Management</Title>
      <Text color="#1A2F48" size="lg">
        Power up water management and make informed decisions with Aquamon
        solution.
      </Text>
    </Box>
  );
};
