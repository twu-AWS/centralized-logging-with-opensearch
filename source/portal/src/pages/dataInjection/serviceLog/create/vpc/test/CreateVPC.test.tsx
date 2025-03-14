/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from "react";
import { renderWithProviders } from "test-utils";
import { AppStoreMockData } from "test/store.mock";
import { MemoryRouter } from "react-router-dom";
import CreateVPC from "../CreateVPC";
import { appSyncRequestMutation, appSyncRequestQuery } from "assets/js/request";
import { mockOpenSearchStateData } from "test/domain.mock";
import { screen, act, fireEvent, within } from "@testing-library/react";
import {
  MockGrafanaData,
  MockLightEngineData,
  MockResourceLoggingBucketData,
  MockSelectProcessorState,
  MockVPCList,
  MockVPCLogSourceList,
} from "test/servicelog.mock";

// Mock SelectLogProcessor
jest.mock("pages/comps/processor/SelectLogProcessor", () => {
  return {
    __esModule: true,
    default: () => <div>SelectLogProcessor</div>,
  };
});

jest.mock(
  "pages/dataInjection/serviceLog/create/common/ConfigLightEngine",
  () => {
    return {
      __esModule: true,
      default: () => <div>ConfigLightEngine</div>,
      covertSvcTaskToLightEngine: jest.fn(),
    };
  }
);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (key: any) => key,
      i18n: {
        changeLanguage: jest.fn(),
      },
    };
  },
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

jest.mock("assets/js/request", () => ({
  appSyncRequestQuery: jest.fn(),
  appSyncRequestMutation: jest.fn(),
}));

describe("CreateVPC", () => {
  it("renders with data for openSearch manual", async () => {
    (appSyncRequestQuery as any).mockResolvedValue({
      data: {
        listResources: MockVPCList,
        checkOSIAvailability: true,
        getAccountUnreservedConurrency: 1000,
      },
    });

    (appSyncRequestMutation as any).mockResolvedValue({
      data: { createPipelineParams: "OK" },
    });

    await act(async () => {
      renderWithProviders(
        <MemoryRouter
          initialEntries={[
            "/log-pipeline/service-log/create/vpc?engineType=OPENSEARCH&ingestLogType=S3",
          ]}
        >
          <CreateVPC />
        </MemoryRouter>,
        {
          preloadedState: {
            app: {
              ...AppStoreMockData,
            },
            openSearch: {
              ...mockOpenSearchStateData,
            },
            selectProcessor: {
              ...MockSelectProcessorState,
            },
          },
        }
      );
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // change to manual mode
    const manualModeOption = screen.getByText("servicelog:create.manual");
    fireEvent.click(manualModeOption);

    // input manual vpc id
    const manualVPCId = screen.getByPlaceholderText("servicelog:vpc.inputVpc");
    fireEvent.change(manualVPCId, {
      target: { value: "vpc-1" },
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // input s3 log bucket name
    const logBucketName = screen.getByPlaceholderText("s3://bucket/prefix");
    fireEvent.change(logBucketName, {
      target: { value: "s3://test-bucket/prefix" },
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // input shard number
    const shardNum = screen.getByPlaceholderText(
      "servicelog:cluster.inputShardNum"
    );
    fireEvent.change(shardNum, { target: { value: 1 } });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // click create button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-create-button"));
    });
  });

  it("renders with data for openSearch Auto", async () => {
    (appSyncRequestQuery as any).mockResolvedValue({
      data: {
        listResources: MockVPCList,
        checkOSIAvailability: true,
        getAccountUnreservedConurrency: 1000,
        getResourceLogConfigs: MockVPCLogSourceList,
      },
    });

    (appSyncRequestMutation as any).mockResolvedValue({
      data: { createPipelineParams: "OK" },
    });

    await act(async () => {
      renderWithProviders(
        <MemoryRouter
          initialEntries={[
            "/log-pipeline/service-log/create/vpc?engineType=OPENSEARCH&ingestLogType=S3",
          ]}
        >
          <CreateVPC />
        </MemoryRouter>,
        {
          preloadedState: {
            app: {
              ...AppStoreMockData,
            },
            openSearch: {
              ...mockOpenSearchStateData,
            },
            selectProcessor: {
              ...MockSelectProcessorState,
            },
          },
        }
      );
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // select auto vpc id
    const autocomplete = screen.getByPlaceholderText(
      "servicelog:vpc.selectVpc"
    );
    autocomplete.focus();
    // the value here can be any string you want, so you may also consider to
    // wrapper it as a function and pass in inputValue as parameter
    fireEvent.change(autocomplete, { target: { value: "v" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // select flow type
    const selectFlowItem = screen.getByRole("button", {
      name: /servicelog:vpc.selectFlowLog/i,
    });
    await act(async () => {
      fireEvent.mouseDown(selectFlowItem);
    });
    const listFlowLogType = within(document.body).getByRole("listbox");
    const flowType = await within(listFlowLogType).findByText("fl-1 (vpc-1)");
    fireEvent.click(flowType);

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // input shard number
    const shardNum = screen.getByPlaceholderText(
      "servicelog:cluster.inputShardNum"
    );
    fireEvent.change(shardNum, { target: { value: 1 } });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // click create button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-create-button"));
    });
  });

  it("renders with data for light-engine", async () => {
    (appSyncRequestQuery as any).mockResolvedValue({
      data: {
        listResources: MockVPCList,
        checkOSIAvailability: true,
        getAccountUnreservedConurrency: 1000,
        getResourceLogConfigs: MockVPCLogSourceList,
        getResourceLoggingBucket: {
          ...MockResourceLoggingBucketData,
          enabled: true,
        },
      },
    });

    (appSyncRequestMutation as any).mockResolvedValue({
      data: { createLightEngineServicePipeline: "OK" },
    });

    await act(async () => {
      renderWithProviders(
        <MemoryRouter
          initialEntries={[
            "/log-pipeline/service-log/create/vpc?engineType=LIGHT_ENGINE&ingestLogType=S3",
          ]}
        >
          <CreateVPC />
        </MemoryRouter>,
        {
          preloadedState: {
            app: {
              ...AppStoreMockData,
            },
            openSearch: {
              ...mockOpenSearchStateData,
            },
            selectProcessor: {
              ...MockSelectProcessorState,
            },
            grafana: {
              ...MockGrafanaData,
            },
            createLightEngine: {
              ...MockLightEngineData,
            },
          },
        }
      );
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // select auto vpc id
    const autocomplete = screen.getByPlaceholderText(
      "servicelog:vpc.selectVpc"
    );
    autocomplete.focus();
    // the value here can be any string you want, so you may also consider to
    // wrapper it as a function and pass in inputValue as parameter
    fireEvent.change(autocomplete, { target: { value: "v" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // click next button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-next-button"));
    });

    // click create button
    await act(async () => {
      fireEvent.click(screen.getByTestId("vpc-create-button"));
    });
  });
});
