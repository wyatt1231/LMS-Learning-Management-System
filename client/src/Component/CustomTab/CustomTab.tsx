import { Tab, Tabs } from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";

interface ICustomTab {
  tabs: Array<ITabItems>;
  height?: number;
}

interface ITabItems {
  title: string;
  RenderComponent: any;
}

const CustomTab: React.FC<ICustomTab> = memo(({ tabs, height }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = useCallback((prop: any, value: number) => {
    setActiveTab(value);
  }, []);

  return (
    <div className="div">
      <StyledCustomTab value={activeTab} onChange={handleChangeTab}>
        {tabs.map((tab: any, index: number) => (
          <StyledTab key={index} label={tab.title} value={index} />
        ))}
      </StyledCustomTab>

      {tabs.map(
        (tab: any, index: number) =>
          activeTab === index && (
            <AnimatePresence key={index}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="custom-tab-content"
                style={{
                  height: height,
                }}
              >
                {tab?.RenderComponent}
              </motion.div>
            </AnimatePresence>
          )
      )}
    </div>
  );
});

export default CustomTab;

const StyledTabCtnr = styled.div``;

const StyledCustomTab = styled(Tabs)`
  /* border-bottom: 1px solid #e8e8e8; */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  .MuiTabs-indicator {
    background-color: #1890ff;
  }
`;

const StyledTab = styled(Tab)`
  text-transform: none;
  min-width: 72;
  font-weight: 500;
  margin-right: 0.5em;
  font-size: 0.87em;
  text-transform: uppercase;

  &:hover {
    color: #40a9ff;
    opacity: 1;
  }

  &.selected {
    color: #1890ff;
    font-weight: 500;
  }

  &:focus {
    color: #40a9ff;
  }
`;
