import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit';
import { Web3AuthOptions } from '@web3auth/modal';
import { Web3Auth } from '@web3auth/modal';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CHAIN_NAMESPACES, IProvider } from '@web3auth/base';
import {
  OpenloginAdapter,
  OPENLOGIN_NETWORK,
} from '@web3auth/openlogin-adapter';
// import RPC from "./web3RPC"; // for using web3.js
import RPC from '../ethersRPC'; // for using ethers.js

// Plugins
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin';
import { Flex, Heading } from '@chakra-ui/react';
import { assets } from '../assets';
import Button from '@components/Button';

// Adapters
// import { MetamaskAdapter } from "@web3auth/metamask-adapter";
// import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

const clientId =
  'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ'; // get from https://dashboard.web3auth.io

const web3auth = new Web3Auth({
  clientId,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x1',
    rpcTarget: 'https://rpc.ankr.com/eth', // This is the public RPC we have added, please pass on your own endpoint while creating an app
  },
  // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
  // Please remove this parameter if you're on the Base Plan
  uiConfig: {
    appName: 'W3A',
    // appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
    theme: {
      primary: 'red',
    },
    mode: 'dark',
    logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
    logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
    defaultLanguage: 'en', // en, de, ja, ko, zh, es, fr, pt, nl
    loginGridCol: 3,
    primaryButton: 'externalLogin', // "externalLogin" | "socialLogin" | "emailLogin"
  },
  web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
});

const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: 'optional',
  },
  adapterSettings: {
    uxMode: 'redirect', // "redirect" | "popup"
    whiteLabel: {
      logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
      logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
      defaultLanguage: 'en', // en, de, ja, ko, zh, es, fr, pt, nl
      mode: 'dark', // whether to enable dark, light or auto mode. defaultValue: auto [ system theme]
    },
    mfaSettings: {
      deviceShareFactor: {
        enable: true,
        priority: 1,
        mandatory: true,
      },
      backUpShareFactor: {
        enable: true,
        priority: 2,
        mandatory: false,
      },
      socialBackupFactor: {
        enable: true,
        priority: 3,
        mandatory: false,
      },
      passwordFactor: {
        enable: true,
        priority: 4,
        mandatory: false,
      },
    },
  },
});
web3auth.configureAdapter(openloginAdapter);

const torusPlugin = new TorusWalletConnectorPlugin({
  torusWalletOpts: {},
  walletInitOptions: {
    whiteLabel: {
      theme: { isDark: true, colors: { primary: '#00a8ff' } },
      logoDark: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
      logoLight: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
    },
    useWalletConnect: true,
    enableLogging: true,
  },
});
web3auth.addPlugin(torusPlugin);

// Safe Auth Kit
// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
const options: Web3AuthOptions = {
  clientId: 'YOUR_WEB3_AUTH_CLIENT_ID', // https://dashboard.web3auth.io/
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x5',
    // https://chainlist.org/
    rpcTarget: 'https://rpc.ankr.com/eth_goerli',
  },
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook'],
  },
};

// const web3AuthConfig: Web3AuthConfig = {
//   txServiceUrl: 'https://safe-transaction-goerli.safe.global',
// };

// // Instantiate and initialize the pack
// const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
// await web3AuthModalPack.init({
//   options,
//   adapters: [openloginAdapter],
//   modalConfig,
// });

// Safe Auth Kit -- end

interface PropTypes {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

function LoginComponent({ loggedIn, setLoggedIn }: PropTypes) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  // const [loggedIn, setLoggedIn] = useState(false);

  console.log('logged in?' + JSON.stringify(loggedIn));

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const toMainGamePage = async (providerParam) => {
    if (!providerParam) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(providerParam);
    const publicKey = await rpc.getAccounts();
    const privateKey = await rpc.getPrivateKey();
    const userTwitterAccountInfo = await web3auth.getUserInfo();

    const loginData = {
      publicKey: publicKey,
      privateKey: privateKey,
      userTwitterAccountInfo: userTwitterAccountInfo,
    };

    navigate('/', { state: { loginData } });
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const web3authProvider = await web3auth.connect();
    await toMainGamePage(web3authProvider);
    setProvider(web3authProvider);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const showWCM = async () => {
    if (!torusPlugin) {
      uiConsole('torus plugin not initialized yet');
      return;
    }
    torusPlugin.showWalletConnectScanner();
    uiConsole();
  };

  const initiateTopUp = async () => {
    if (!torusPlugin) {
      uiConsole('torus plugin not initialized yet');
      return;
    }
    torusPlugin.initiateTopup('moonpay', {
      selectedAddress: '0x8cFa648eBfD5736127BbaBd1d3cAe221B45AB9AF',
      selectedCurrency: 'USD',
      fiatValue: 100,
      selectedCryptoCurrency: 'ETH',
      chainNetwork: 'mainnet',
    });
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const addChain = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const newChain = {
      chainId: '0x5',
      displayName: 'Goerli',
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      tickerName: 'Goerli',
      ticker: 'ETH',
      decimals: 18,
      rpcTarget: 'https://rpc.ankr.com/eth_goerli',
      blockExplorer: 'https://goerli.etherscan.io',
    };
    await web3auth.addChain(newChain);
    uiConsole('New Chain Added');
  };

  const switchChain = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    await web3auth?.switchChain({ chainId: '0x5' });
    uiConsole('Chain Switched');
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const readContract = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const message = await rpc.readFromContract();
    uiConsole(message);
  };

  const writeContract = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const message = await rpc.writeToContract();
    uiConsole(message);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  const geUserData = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const publicKey = await rpc.getAccounts();
    const privateKey = await rpc.getPrivateKey();
    const userTwitterAccountInfo = await web3auth.getUserInfo();

    uiConsole(
      'Public Key: ' + publicKey,
      'Private Key: ' + privateKey,
      userTwitterAccountInfo
    );
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <Button onClick={logout} colorScheme="twitter" size="lg">
      Log Out
    </Button>
  );

  const unloggedInView = (
    <Button onClick={login} colorScheme="twitter" size="lg">
      Login via Twitter
    </Button>
  );

  return (
    <Flex
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      color="white"
      padding={4}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Flex>{loggedIn ? loggedInView : unloggedInView}</Flex>
    </Flex>
  );
}

export default LoginComponent;
