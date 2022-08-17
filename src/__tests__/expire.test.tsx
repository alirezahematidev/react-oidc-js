import { render, act, fireEvent } from "@testing-library/react";
import React from "react";
import { createUserManagerContext, useAuth } from "../index";

describe("useAuth", () => {
  beforeAll(() => {
    // Lock Time
    // Log.logger = console;
    jest.useRealTimers();
  });

  const accessToken =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIyNDEwODk4RURBMUQzQkQwRTU1OUM0MjQ0NTk1MkJDNTU1OUVDOUNSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IklrRUltTzJoMDcwT1ZaeENSRmxTdkZWWjdKdyJ9.eyJuYmYiOjE2NDAxOTQ3OTEsImV4cCI6MTY0MDIwNjc5MSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzYwMCIsImF1ZCI6WyJjbGllbnQiLCJub3RpZiJdLCJjbGllbnRfaWQiOiJEN0Q4MzJGQi0wMEM4LTRGRTktODFEOC03NkM1NzE4RkQ3RTQiLCJEb21haW5JZCI6IjEiLCJzdWIiOiJhYWVlMDc4NS0xZTBiLTRhMzgtOTc2My0wOGQ3OWQ3NzE4ZjAiLCJhdXRoX3RpbWUiOjE2NDAxOTQ3OTEsImlkcCI6ImxvY2FsIiwiZGV2aWNlSWQiOiJ1bmRlZmluZWQiLCJyb2xlIjpbIlVzZXIiLCJTdWJVc2VyIl0sImp0aSI6IjlEOTY5OEMyOTUwQzFENEE5NUJBMjFCMzU1MzY1OTg2IiwiaWF0IjoxNjQwMTk0NzkxLCJzY29wZSI6WyJjbGllbnQiLCJub3RpZiIsIm9wZW5pZCIsInByb2ZpbGUiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.SZOEKRlBaO_1VMt4UZ4xk1UUzxNcMJV3anvSncpM_nJxdVQSw1NI9CWMZ5PGnK4-r_2UjqUXFV8VCfrD1g9WbD_Xqan44rwJpj6dFIXwe29Pi5j0x1Luo62eCeJgQ-kMK2ocqXK8fbZlRynUzTDHDwUNNPdIHI4FQQbmRGCg57zlfY2qRgn_u-dGaobjAnDD-vyYZ_KYuph_iTrGPOtblbnSgi2mK00GTOXuXwV-46dCvjbsWhCKjB4dKmrIuEk0j04FUCxZsR9NKkQneo3bT22z6PLl1158-VIWd68RtElJ3E0nzjFIFiDHfoj0cl74UnHdL8xBbREefs_oG0taiA";

  let refreshCount = 1;

  const UserManagerContext = createUserManagerContext({
    client_id: "client_id",
    authority: "authority",
    accessTokenExpiringNotificationTimeInSeconds: 5,
    onRefresh: async () => {
      refreshCount++;

      return {
        access_token: accessToken,
        refresh_token: "refresh_token" + refreshCount,
        expires_in: 15,
        token_type: "token_type",
      };
    },
  });

  function TextInputTester() {
    const { userData, setUser, removeUser } = useAuth();

    const login = async () => {
      await setUser({
        access_token: accessToken,
        refresh_token: "refresh_token",
        expires_in: 15,
        token_type: "token_type",
      });
    };

    const logout = async () => {
      await removeUser();
    };

    return (
      <p
        data-testid="response"
        data-userdata={userData && JSON.stringify(userData)}
        onClick={login}
        onDoubleClick={logout}
      />
    );
  }

  test("expire", async () => {
    const component = render(
      <UserManagerContext.Provider>
        <TextInputTester />
      </UserManagerContext.Provider>
    );

    expect(
      (await component.findByTestId("response")).getAttribute("data-userdata")
    ).toBe(null);

    fireEvent.click(await component.findByTestId("response"));
    await act(() => sleep(500));

    const str = (await component.findByTestId("response")).getAttribute(
      "data-userdata"
    );
    expect(str ? JSON.parse(str).refresh_token : null).toBe("refresh_token");

    expect((await UserManagerContext.getUser())?.refresh_token).toBe(
      "refresh_token"
    );

    await act(() => sleep(12000));

    expect((await UserManagerContext.getUser())?.refresh_token).toBe(
      "refresh_token2"
    );

    await act(() => sleep(12000));

    const str2 = component
      .getByTestId("response")
      .getAttribute("data-userdata");

    expect(str2 ? JSON.parse(str2).refresh_token : null).toBe("refresh_token3");
  }, 80000);
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
