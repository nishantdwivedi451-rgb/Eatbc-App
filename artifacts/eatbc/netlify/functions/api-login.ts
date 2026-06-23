import { adapt } from "./_shim";
import loginHandler from "../../api/login";
export const handler = adapt(loginHandler);
