import { adapt } from "./_shim";
import registerHandler from "../../api/register";
export const handler = adapt(registerHandler);
