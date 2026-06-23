import { adapt } from "./_shim";
import deleteHandler from "../../api/delete";
export const handler = adapt(deleteHandler);
