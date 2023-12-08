[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Static Badge](https://img.shields.io/badge/Lang-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)

# easy-rscp-js

easy-rscp is an INOFFICIAL library written in Typescript (fully JS compatible) for accessing E3DC home power stations.

E3DC is a brand of HagerEnergy Gmbh ([website](https://www.e3dc.com/)). I have nothing to do with the company, except that I own a home power plant from E3DC and wanted to include it in my SmartHome. This "desire" gave birth to easy-rscp.

This library is a port of [easy-rscp](https://github.com/jnk-cons/easy-rscp). Most of the classes and principles from easy-rscp also work here.

## Getting started

Du kannst die Bibliothek auf 2 verschiedene Arten verwenden, entweder du nutzt die vorgefertigten Services oder, wenn du mehr
Funktionen brauchst, nutzt du die Lowlevel API.

### Service

```typescript
import {
  DefaultHomePowerPlantConnection,
  DefaultInfoService,
  E3dcConnectionData,
  RijndaelJsAESCipherFactory
} from 'easy-rscp-js';

const connectionData: E3dcConnectionData = {
    address : 'IP of your home power station',
    port : 5033,
    portalUser : 'user username for the e3dc portal',
    portalPassword : 'the corresponding password',
    rscpPassword : 'Das RSCP Passwort, dass an der home power station konfigufiert ist'
}

const aesFactory = new RijndaelJsAESCipherFactory(connectionData.rscpPassword)
const connection = new DefaultHomePowerPlantConnection(easyRscpConnectionData, aesFactory)
const infoService = new DefaultInfoService(connection)
infoService
    .readSystemInfo()
    .then(infos => {
        console.log(infos)
    })
    .catch(e => {
        console.error(e)
    })
    .finally(() => connection.disconnect())
```

### LowLevel

```typescript
import {
  DefaultHomePowerPlantConnection,
  E3dcConnectionData,
  RijndaelJsAESCipherFactory,
  DataBuilder,
  EMSTag,
  FrameBuilder,
  StringFrameConverter
} from 'easy-rscp-js';

const connectionData: E3dcConnectionData = {
    address : 'IP of your home power station',
    port : 5033,
    portalUser : 'user username for the e3dc portal',
    portalPassword : 'the corresponding password',
    rscpPassword : 'Das RSCP Passwort, dass an der home power station konfigufiert ist'
}

const aesFactory = new RijndaelJsAESCipherFactory(this.settings.rscpKey)
const connection = new DefaultHomePowerPlantConnection(easyRscpConnectionData, aesFactory)
const request = new FrameBuilder()
    .addData(
        new DataBuilder().tag(EMSTag.REQ_POWER_PV).build(),
        new DataBuilder().tag(EMSTag.REQ_POWER_BAT).build(),
        new DataBuilder().tag(EMSTag.REQ_POWER_GRID).build(),
        new DataBuilder().tag(EMSTag.REQ_POWER_HOME).build(),
        new DataBuilder().tag(EMSTag.REQ_BAT_SOC).build(),
    )
    .build();

connection
    .send(request)
    .then(r => {
        console.log(new StringFrameConverter().convert(r))
    })
    .catch(e => console.error(e))
    .finally(() => connection.disconnect())
```

## Support
You want to help? Great! You are welcome. Any help is welcome.

You can submit bugs or feature requests via the GitHUB issues section.

If you have a pull request, it is of course welcome.

You want to become a maintainer? Create a ticket in the issues section and I'll get back to you.

## License
The project is published under the MIT license. Just look at the LICENSE file in the repository