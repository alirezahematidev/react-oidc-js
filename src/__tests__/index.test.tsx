import renderer, { act } from "react-test-renderer";
import React from "react";
// import { createUserManagerContext, useAuth } from "../index";
import jwtDecode from "jwt-decode";

describe("useAuth", () => {
  const decodedAccessToken: any = jwtDecode(
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIyNDEwODk4RURBMUQzQkQwRTU1OUM0MjQ0NTk1MkJDNTU1OUVDOUNSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IklrRUltTzJoMDcwT1ZaeENSRmxTdkZWWjdKdyJ9.eyJuYmYiOjE2NDAyNjAwMzgsImV4cCI6MTY0MDI3MjAzOCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzYwMCIsImF1ZCI6WyJjbGllbnQiLCJub3RpZiJdLCJjbGllbnRfaWQiOiJEN0Q4MzJGQi0wMEM4LTRGRTktODFEOC03NkM1NzE4RkQ3RTQiLCJEb21haW5JZCI6IjEiLCJzdWIiOiJhYWVlMDc4NS0xZTBiLTRhMzgtOTc2My0wOGQ3OWQ3NzE4ZjAiLCJhdXRoX3RpbWUiOjE2NDAyNjAwMzgsImlkcCI6ImxvY2FsIiwiZGV2aWNlSWQiOiJ1bmRlZmlu…MDhEMzMzOUFFNjI5QTRBQkIzRDI2OEMwMDkzMENDIiwiaWF0IjoxNjQwMjYwMDM4LCJzY29wZSI6WyJjbGllbnQiLCJub3RpZiIsIm9wZW5pZCIsInByb2ZpbGUiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.rQJQqhMdlKnZgIBeY4pgiaqu-gGhkVXQmt02wio2hM0NSU20rH6ItoC_OPxHfULkhC3sj3RJ5gO2jcd7GQB40UGLjZmzcbUEKh_fdGAjenPva8-FomNoY3o0ar8hNVGs5FYe8rkAYWxG6WLvYwL76N_oHN9GuBpKopHUUiMJjtUNBNIIAcAsP6SCAEYgltCcW6HLu7A07WUo6Kzl_uKWApcPvTvGXZFk-EOpi5jMmRxdRYIIf4OeviBXMDEntAwjsEagrdzPQrgrGFlh9G511l6xTvKSlfmbpNLuiUZy-UMGwnWdxNifTHicD1admrRk_xzbudUKDPnvxp0IwcUSJg"
  );
  console.log(decodedAccessToken);

  // const UserManagerContext = createUserManagerContext({
  //   client_id: "client_id",
  //   redirect_uri: "",
  //   response_type: "password",
  //   authority: "authority",
  //   client_secret: "client_secret",
  //   automaticSilentRenew: false,
  // });

  // function TextInputTester() {
  //   const { userData, setUser } = useAuth();

  //   const login = async () => {
  //     await setUser({
  //       access_token:
  //         "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIyNDEwODk4RURBMUQzQkQwRTU1OUM0MjQ0NTk1MkJDNTU1OUVDOUNSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IklrRUltTzJoMDcwT1ZaeENSRmxTdkZWWjdKdyJ9.eyJuYmYiOjE2NDAyNjAwMzgsImV4cCI6MTY0MDI3MjAzOCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzYwMCIsImF1ZCI6WyJjbGllbnQiLCJub3RpZiJdLCJjbGllbnRfaWQiOiJEN0Q4MzJGQi0wMEM4LTRGRTktODFEOC03NkM1NzE4RkQ3RTQiLCJEb21haW5JZCI6IjEiLCJzdWIiOiJhYWVlMDc4NS0xZTBiLTRhMzgtOTc2My0wOGQ3OWQ3NzE4ZjAiLCJhdXRoX3RpbWUiOjE2NDAyNjAwMzgsImlkcCI6ImxvY2FsIiwiZGV2aWNlSWQiOiJ1bmRlZmlu…MDhEMzMzOUFFNjI5QTRBQkIzRDI2OEMwMDkzMENDIiwiaWF0IjoxNjQwMjYwMDM4LCJzY29wZSI6WyJjbGllbnQiLCJub3RpZiIsIm9wZW5pZCIsInByb2ZpbGUiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.rQJQqhMdlKnZgIBeY4pgiaqu-gGhkVXQmt02wio2hM0NSU20rH6ItoC_OPxHfULkhC3sj3RJ5gO2jcd7GQB40UGLjZmzcbUEKh_fdGAjenPva8-FomNoY3o0ar8hNVGs5FYe8rkAYWxG6WLvYwL76N_oHN9GuBpKopHUUiMJjtUNBNIIAcAsP6SCAEYgltCcW6HLu7A07WUo6Kzl_uKWApcPvTvGXZFk-EOpi5jMmRxdRYIIf4OeviBXMDEntAwjsEagrdzPQrgrGFlh9G511l6xTvKSlfmbpNLuiUZy-UMGwnWdxNifTHicD1admrRk_xzbudUKDPnvxp0IwcUSJg",
  //       refresh_token: "refresh_token",
  //       expires_at: new Date().getTime() + 100000,
  //       token_type: "token_type",
  //     });
  //   };

  //   return <p data-userData={userData} onClick={login} />;
  // }

  // let component: renderer.ReactTestRenderer;

  // beforeEach(() => {
  //   component = renderer.create(
  //     <UserManagerContext.Provider>
  //       <TextInputTester />
  //     </UserManagerContext.Provider>
  //   );
  // });
  // test("is empty", () => {
  //   const tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  // test("login", async () => {
  //   let tree = component.toJSON() as any;

  //   await act(async () => {
  //     await tree?.props.onClick();
  //   });

  //   const json = component.toJSON();
  //   expect(json).toMatchSnapshot();
  // });
});
