import inputSchema from '../private-examples/input.schema.json'
import {jsonSchemaToTypescript} from "../src/jsonSchemaToTypescript";
import {JSONSchema7} from "json-schema";
import fs from 'fs'

test("works with a shallow object", () => {
  const output = jsonSchemaToTypescript(inputSchema as JSONSchema7);
  fs.writeFileSync('private-examples/MyTsTypes.d.ts', output)
});
