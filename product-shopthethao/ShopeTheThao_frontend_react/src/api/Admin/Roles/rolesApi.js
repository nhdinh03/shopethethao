import BaseApi from "api/global/baseApi";

class Roles extends BaseApi {
  constructor() {
    super("role");
  }
}

const rolesApi = new Roles();
export default rolesApi;
