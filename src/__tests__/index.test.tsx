import renderer, { act } from "react-test-renderer";
import React from "react";
import { createUserManagerContext, useAuth } from "../index";
import jwtDecode from "jwt-decode";

describe("useAuth", () => {
  const accessToken =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIyNDEwODk4RURBMUQzQkQwRTU1OUM0MjQ0NTk1MkJDNTU1OUVDOUNSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IklrRUltTzJoMDcwT1ZaeENSRmxTdkZWWjdKdyJ9.eyJuYmYiOjE2NDAxOTQ3OTEsImV4cCI6MTY0MDIwNjc5MSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzYwMCIsImF1ZCI6WyJjbGllbnQiLCJub3RpZiJdLCJjbGllbnRfaWQiOiJEN0Q4MzJGQi0wMEM4LTRGRTktODFEOC03NkM1NzE4RkQ3RTQiLCJEb21haW5JZCI6IjEiLCJzdWIiOiJhYWVlMDc4NS0xZTBiLTRhMzgtOTc2My0wOGQ3OWQ3NzE4ZjAiLCJhdXRoX3RpbWUiOjE2NDAxOTQ3OTEsImlkcCI6ImxvY2FsIiwiZGV2aWNlSWQiOiJ1bmRlZmluZWQiLCJyb2xlIjpbIlVzZXIiLCJTdWJVc2VyIl0sImp0aSI6IjlEOTY5OEMyOTUwQzFENEE5NUJBMjFCMzU1MzY1OTg2IiwiaWF0IjoxNjQwMTk0NzkxLCJzY29wZSI6WyJjbGllbnQiLCJub3RpZiIsIm9wZW5pZCIsInByb2ZpbGUiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.SZOEKRlBaO_1VMt4UZ4xk1UUzxNcMJV3anvSncpM_nJxdVQSw1NI9CWMZ5PGnK4-r_2UjqUXFV8VCfrD1g9WbD_Xqan44rwJpj6dFIXwe29Pi5j0x1Luo62eCeJgQ-kMK2ocqXK8fbZlRynUzTDHDwUNNPdIHI4FQQbmRGCg57zlfY2qRgn_u-dGaobjAnDD-vyYZ_KYuph_iTrGPOtblbnSgi2mK00GTOXuXwV-46dCvjbsWhCKjB4dKmrIuEk0j04FUCxZsR9NKkQneo3bT22z6PLl1158-VIWd68RtElJ3E0nzjFIFiDHfoj0cl74UnHdL8xBbREefs_oG0taiA";

  const UserManagerContext = createUserManagerContext({
    client_id: "client_id",
    authority: "authority",
  });

  function TextInputTester() {
    const { userData, setUser, removeUser } = useAuth();

    const login = async () => {
      await setUser({
        access_token: accessToken,
        refresh_token: "refresh_token",
        expires_at: 1640421466001,
        token_type: "token_type",
      });
    };

    const logout = async () => {
      await removeUser();
    };

    return (
      <p data-userData={userData} onClick={login} onDoubleClick={logout} />
    );
  }

  let component: renderer.ReactTestRenderer;

  beforeEach(() => {
    component = renderer.create(
      <UserManagerContext.Provider>
        <TextInputTester />
      </UserManagerContext.Provider>
    );
  });
  test("is empty", () => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("login", async () => {
    let tree = component.toJSON() as any;

    await act(async () => {
      await tree?.props.onClick();
    });

    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test("logout", async () => {
    let tree = component.toJSON() as any;

    await act(async () => {
      await tree?.props.onDoubleClick();
    });

    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
