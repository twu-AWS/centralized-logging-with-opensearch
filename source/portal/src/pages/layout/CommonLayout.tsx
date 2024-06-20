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

import Breadcrumb, { BreadcrumbType } from "components/Breadcrumb/breadcrumb";
import HelpPanel from "components/HelpPanel";
import LoadingText from "components/LoadingText";
import SideMenu from "components/SideMenu";
import React, { ReactElement } from "react";
import NotificationBar from "./NotificationBar";

interface CommonLayoutProps {
  children: ReactElement | ReactElement[];
  breadCrumbList?: BreadcrumbType[];
  loadingData?: boolean;
  hideMenu?: boolean;
  hideHelper?: boolean;
}

const CommonLayout: React.FC<CommonLayoutProps> = (
  props: CommonLayoutProps
) => {
  const { children, breadCrumbList, loadingData, hideMenu, hideHelper } = props;
  return (
    <div className="lh-main-content">
      {!hideMenu && <SideMenu />}
      <div className="lh-container">
        <NotificationBar />
        <div className="lh-content">
          <div className="service-log">
            {breadCrumbList && <Breadcrumb list={breadCrumbList} />}
            {loadingData ? <LoadingText /> : children}
          </div>
        </div>
      </div>
      {!hideHelper && <HelpPanel />}
    </div>
  );
};

export default CommonLayout;
