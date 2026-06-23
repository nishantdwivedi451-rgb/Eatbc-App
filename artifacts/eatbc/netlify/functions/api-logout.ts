import { adapt } from "./_shim";
import logoutHandler from "../../api/logout";
export const handler = adapt(logoutHandler);
