import * as React from "react";

import styled from "styled-components";

import { Header } from "semantic-ui-react";

import { Labelled } from "@/components/Labelled";

import { ScanningDot } from "@/components/ScanningDot";

export const ConnectionStatusDisplay: React.FC<{
    icon?: any;
    iconHoverText?: string;
    onIconClick?: () => void;
    headerText: string;
    headerHoverTitle?: string;
    onHeaderClick?: () => void;
    color?: string;
    shouldPulse?: boolean;
}> = props => {
    const Outer = styled.div`
    padding: 10px 0;
    display: flex;
    `;
    const ConnectInfo = styled.div`
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    `;
    return (
        <Outer>
            {props.icon &&
                <Labelled disabled={!props.iconHoverText} title={props.iconHoverText}>
                    <img
                        src={props.icon}
                        onClick={props.onIconClick}
                        style={{
                            height: "35px",
                            width: "35px",
                            cursor: props.onIconClick ? "pointer" : "auto",
                        }}
                    />
                </Labelled>
            }
            <ConnectInfo>
                <Labelled disabled={!Boolean(props.headerHoverTitle)} title={props.headerHoverTitle} onClick={props.onHeaderClick} position="right">
                    <Header sub>
                        <ScanningDot shouldPulse={props.shouldPulse} color={props.color || "red"} /> {props.headerText}
                    </Header>
                </Labelled>
                {props.children && <span>{props.children}</span>}
            </ConnectInfo>
        </Outer>
    );
};
