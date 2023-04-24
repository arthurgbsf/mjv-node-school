import * as fs from 'fs';
import { basicInfo } from "./basicInfo/basicInfo.doc";
import {paths} from "./paths/paths.doc";
import { components } from './components/components.doc';

const swagger = {
    ...basicInfo,
    ...paths,
    ...components
}

const swaggerJSON = JSON.stringify(swagger);
fs.writeFileSync('./src/docs/swagger.doc.json', swaggerJSON);