const coinDataTranslated = require('./coinDataTranslated')
const zcashParamsSources = require('./zcashParamsSources')

let zCoins = {}
let nativeCoinStrings = {}

const coinObjArray = coinDataTranslated.getSimpleCoinArray().map(simpleCoinObj => {
  const coinObj = coinDataTranslated.getCoinObj(simpleCoinObj.id, false)

  if (coinObj.tags.includes('is_zcash')) zCoins[coinObj.id] = true
  else zCoins[coinObj.id] = false

  if (coinObj.available_modes.native === true) {
    nativeCoinStrings[coinObj.id] = ''
  }

  return coinObj
})

const appConfig = {
  config: {
    display: {
      mining: {
        wallet: {
          openMiningBooklets: [{}],
          openStakingBooklets: [{}],
        }
      }
    },
    general: {
      main: {
        host: "127.0.0.1",
        agamaPort: 17775,
        maxDescriptors: {
          darwin: 90000,
          linux: 1000000
        },
        dev: false,
        debug: false,
        roundValues: false,
        experimentalFeatures: false,
        dex: {
          walletUnlockTimeout: 3600
        },
        lang: "EN",
        fiatRates: true,
        fiatCurrency: "USD",
        requirePinToConfirmTx: false,
        defaultUserId: "",
        reservedChains: coinObjArray
          .map(coinObj => coinObj.id)
          .concat(["KOMODO", "zcashd", "komodod", "chipsd"]),
        pbaasChains: [],
        pbaasTestmode: true,
        alwaysPromptUpdates: true,
        encryptApiPost: true
      },
      electrum: {
        maxVinParseLimit: 120,
        cache: false,
        socketTimeout: 10000,
        customServers: false,
        maxTxListLength: 10,
        csvListtransactionsMaxLength: 400,
        syncServerListFromKv: false
      },
      native: {
        rpc2cli: false,
        cliStopTimeout: 30000,
        failedRPCAttemptsThreshold: 10,
        stopNativeDaemonsOnQuit: true,
        dataDir: "",
        maxTxListLength: 2147483647,
        csvListtransactionsMaxLength: 1000,
        zcashParamsSrc: "verus.io",
        includeP2shAddrs: false,
        includeEmptyChangeAddrs: false,
        defaultShowEmptyAddrs: true,
        nativeCacheMbLimit: 30,
        filterGenerateTransactions: true,
        showAddressCurrencyBalances: true
      }
    },
    coin: {
      native: {
        includePrivateAddrs: zCoins,
        includePrivateBalances: zCoins,
        includePrivateTransactions: zCoins,
        stakeGuard: nativeCoinStrings,
        dataDir: nativeCoinStrings
      }
    },
    pubkey: "",
    exchanges: {
      coinswitchKey: ""
    }
  },
  schema: {
    general: {
      main: {
        host: {
          type: "text_input",
          displayName: "Hostname",
          info: "The application hostname.",
          hidden: true
        },
        agamaPort: {
          type: "number_input",
          displayName: "Verus Port",
          info:
            "The port that the Verus GUI will use to communicate with its back end."
        },
        dev: {
          type: "checkbox",
          displayName: "Dev Mode",
          info: "Run Verus in devmode, where it will search for a running GUI instead of using the pre-compiled one.",
          hidden: true
        },
        pbaasTestmode: {
          type: "checkbox",
          displayName: "Verus Multiverse Testmode",
          info: "Changes Verus Multiverse capabilities to run in test mode. (Will work with only VRSCTEST)",
          hidden: true
        },
        alwaysPromptUpdates: {
          type: "checkbox",
          displayName: "Notify me about all app updates",
          info: "Enables update notifications on app start for all updates, including non-mandatory."
        },
        encryptApiPost: {
          hidden: true
        },
      },
      electrum: {
        socketTimeout: {
          type: "number_input",
          displayName: "Socket Timeout",
          info: "The timeout for connections to electrum."
        },
        customServers: {
          type: "checkbox",
          displayName: "Custom electrum servers",
          info: "Use custom electrum servers."
        },
        maxTxListLength: {
          type: "number_input",
          displayName: "Max Transaction List Length",
          info: "The maximum number of transactions to fetch per call."
        }
      },
      native: {
        maxTxListLength: {
          type: "number_input",
          displayName: "Max Transaction List Length",
          info: "The maximum number of transactions to fetch per call."
        },
        zcashParamsSrc: {
          type: "dropdown",
          options: Object.keys(zcashParamsSources),
          displayName: "ZCash Parameter Source",
          info: "The source for the initial ZCash parameter download."
        },
        includeP2shAddrs: {
          type: "checkbox",
          displayName: "Include Pay to Script Hash Addresses",
          info:
            "Include Pay to Script Hash addresses in your address list (ONLY SEND TO THESE IF YOU KNOW WHAT YOU ARE DOING)."
        },
        nativeCacheMbLimit: {
          type: "decimal_input",
          displayName: "Native Cache Size Limit (in Mb)",
          info:
            "Set the native cache size limit (in megabytes). (Improves performance by storing blockchain data in local memory)"
        },
        includeEmptyChangeAddrs: {
          type: "checkbox",
          displayName: "Include Empty Change Addresses",
          info:
            "Include automatically generated change addresses in your address list, even if they're empty."
        },
        defaultShowEmptyAddrs: {
          type: "checkbox",
          displayName: "Show Empty Addresses by Default",
          info: "Show empty addresses by default when viewing the address list."
        },
        filterGenerateTransactions: {
          type: 'checkbox',
          displayName: 'Separate Mining/Staking Transactions',
          info: 'Filter all mining/staking related transactions out of the main wallet tab, and only show them under the mining tab.',
        },
        showAddressCurrencyBalances: {
          type: 'checkbox',
          displayName: 'Show Currency Balances for Addresses',
          info: 'Show balances for every currency for each of your addresses. May impact performance on large wallets.',
        },
      }
    },
    coin: {
      native: {
        stakeGuard: {
          type: "text_input",
          displayName: "StakeGuard address",
          info:
            "Sapling address for Verus StakeGuard. (Will be used when Verus is started)"
        },
        dataDir: {
          type: "text_input",
          displayName: "Custom data directory",
          info: "A custom directory for coin data."
        }
      }
    }
  }
};

module.exports = appConfig;
