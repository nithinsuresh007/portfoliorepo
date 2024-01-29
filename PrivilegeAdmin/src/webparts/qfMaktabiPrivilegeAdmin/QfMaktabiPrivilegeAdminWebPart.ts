import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'QfMaktabiPrivilegeAdminWebPartStrings';
import QfMaktabiPrivilegeAdmin from './components/QfMaktabiPrivilegeAdmin';
import { IQfMaktabiPrivilegeAdminProps } from './components/IQfMaktabiPrivilegeAdminProps';

export interface IQfMaktabiPrivilegeAdminWebPartProps {
  description: string;
}

export default class QfMaktabiPrivilegeAdminWebPart extends BaseClientSideWebPart<IQfMaktabiPrivilegeAdminWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IQfMaktabiPrivilegeAdminProps> = React.createElement(
      QfMaktabiPrivilegeAdmin,
      {
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
