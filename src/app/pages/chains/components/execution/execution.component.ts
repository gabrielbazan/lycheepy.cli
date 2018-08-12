import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WpsService } from '../../../../services/wps.service';
import { DynamicFormControlModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Chain } from '../../../../models'


@Component({
  selector: 'execution-modal',
  styleUrls: [('./execution.component.scss')],
  templateUrl: './execution.component.html',
})
export class ExecutionModal implements OnInit {

  chain: Chain;

  formModel: DynamicFormControlModel[] = [];
  formGroup: FormGroup;

  constructor(
    private activeModal: NgbActiveModal,
    private wpsService: WpsService,
    private formService: DynamicFormService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createFrom();
  }

  createFrom() {
    this.createFormControls();
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  createFormControls() {

    const dataTypeAndFormTypeMap = {
      'integer': 'number',
      'float': 'number',
      'boolean': 'boolean',
      'positiveInteger': 'number',
      'anyURI': 'url',
      'date': 'date',
      'dateTime': 'datetime',
    };

    for (const input of this.chain.inputs) {
      let inputType;
      let min;

      if (input.dataType) {
        inputType = (input.dataType in dataTypeAndFormTypeMap) ? dataTypeAndFormTypeMap[input.dataType] : 'string';
        if (input.dataType === 'positiveInteger') { min = 0; }
      }else if (input.format) {
        inputType = 'url';
      }

      this.formModel.push(
        new DynamicInputModel({
          id: input.identifier,
          label: input.identifier,
          placeholder: input.title,
          inputType,
          min,
        }),
      );
    }

  }

  execute() {
    const literalInputs = [];
    const complexInputs = [];

    for (const input of this.chain.inputs) {
      if (input.dataType) {
        literalInputs.push(this.getFormInputValue(input.identifier));
      }else if (input.format) {
        complexInputs.push(this.getFormInputValue(input.identifier));
      }
    }

    this.wpsService.execute(this.chain.identifier, literalInputs, complexInputs).subscribe(data => {
      this.closeModal();
    });
  }

  private getFormInputValue(inputIdentifier: string) {
    const imp = this.formService.findById(inputIdentifier, this.formModel) as DynamicInputModel;
    return{ identifier: inputIdentifier, value: imp.value };
  }

  closeModal() {
    this.activeModal.close();
  }

}
