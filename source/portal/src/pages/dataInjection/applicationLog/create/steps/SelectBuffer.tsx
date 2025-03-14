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
import FormItem from "components/FormItem";
import Tiles from "components/Tiles";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AnalyticEngineTypes } from "types";

export enum BufferType {
  NONE = "None",
  KDS = "KDS",
  S3 = "S3",
}

interface SelectBufferProps {
  currentBufferLayer: string;
  changeActiveLayer: (layer: string) => void;
  engineType?: AnalyticEngineTypes;
}

const SelectBuffer: React.FC<SelectBufferProps> = (
  props: SelectBufferProps
) => {
  const { t } = useTranslation();
  const {
    currentBufferLayer,
    changeActiveLayer,
    engineType = AnalyticEngineTypes.OPENSEARCH,
  } = props;
  const selectionItems = useMemo(
    () => [
      {
        value: BufferType.S3,
        label: t("applog:create.ingestSetting.bufferS3"),
        description: t("applog:create.ingestSetting.bufferS3Desc"),
      },
      {
        disabled: engineType === AnalyticEngineTypes.LIGHT_ENGINE,
        value: BufferType.KDS,
        label: t("applog:create.ingestSetting.bufferKDS"),
        description: t("applog:create.ingestSetting.bufferKDSDesc"),
      },
      {
        disabled: engineType === AnalyticEngineTypes.LIGHT_ENGINE,
        value: BufferType.NONE,
        label: t("applog:create.ingestSetting.bufferNone"),
        description: t("applog:create.ingestSetting.bufferNoneDesc"),
      },
    ],
    [engineType]
  );

  return (
    <div className="mb-10">
      <FormItem optionTitle="" optionDesc="">
        <Tiles
          value={currentBufferLayer}
          onChange={(event) => {
            changeActiveLayer(event.target.value);
          }}
          items={selectionItems}
        />
      </FormItem>
    </div>
  );
};

export default SelectBuffer;
