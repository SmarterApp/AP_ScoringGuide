﻿import * as React from 'react';
import * as Rubric from '../PageTabs/Rubric';
import * as AboutItemVM from '../Models/AboutItemVM';
import * as PageTabs from '../PageTabs/PageTabs';
import * as ItemViewerFrame from './ItemViewerFrame';
import * as ItemInformation from '../PageTabs/ItemInformation';
import * as ItemInformationDetail from '../PageTabs/ItemInformationDetail';
import * as ApiModels from '../Models/ApiModels';

export interface Props {
    item?: AboutItemVM.AboutThisItem;
}

export interface State {
    selectedTab: PageTabs.Tabs;
}

export class ItemCardViewer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTab: "viewer",
        }
    }

    onTabChange(tab: PageTabs.Tabs) {
        this.setState({
            selectedTab: tab
        });
    }

    renderViewer(url: string) {
        return (
            <div className="item-content">
                <ItemViewerFrame.ItemFrame url={url} />
            </div>
        );
    }
    
    renderRubric() { 
        if (this.props.item) {
            const rubrics = this.props.item.rubrics.map((ru, i) => <Rubric.RubricComponent {...ru } key={String(i)} />)
            return (
                <div className="item-content">{rubrics}</div>
            );
        }
    }

    renderInformation() {
        if (this.props.item) {
            const aboutItem = this.props.item;
            return (
                <div className="item-content">
                    <div><ItemInformationDetail.ItemInformationDetail
                        itemCardViewModel={aboutItem.itemCardViewModel}
                        depthOfKnowledge={aboutItem.depthOfKnowledge}
                        commonCoreStandardsDescription={aboutItem.commonCoreStandardsDescription}
                        targetDescription={aboutItem.targetDescription}
                        educationalDifficulty={aboutItem.educationalDifficulty}
                        evidenceStatement={aboutItem.evidenceStatement} />
                    </div>
                </div>
            );
        }
    }

    renderChosen() {
        let selectedTab = null;
        if (this.props.item) {
            const selectedTab = this.state.selectedTab;
            const itemCard = this.props.item.itemCardViewModel;

            let resultElement: JSX.Element[] | JSX.Element | undefined;
            if (selectedTab == "viewer") {
                const url = "http://ivs.smarterbalanced.org/items?ids=" + itemCard.bankKey.toString() + "-" + itemCard.itemKey.toString();
                resultElement = <div> {this.renderViewer(url)} </div>
            }
            else if (selectedTab == "rubric") {
                resultElement = <div> {this.renderRubric()} </div>
            }
            else if (selectedTab == "information") {
                resultElement = <div> {this.renderInformation()}</div>
            }
            return resultElement;
        }
    }
    render() {
        const tabs = PageTabs.ItemTabs;
        return (
            <div className="item-card">
                <PageTabs.ItemTabs changedTab={(tab) => this.onTabChange(tab)} selectedTab={this.state.selectedTab} />
                {this.renderChosen()}
            </div>
        );
    }
}