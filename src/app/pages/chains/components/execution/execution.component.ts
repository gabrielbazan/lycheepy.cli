import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WpsService } from '../../../../services/wps.service';
import { DynamicFormControlModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { DynamicFormService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'execution-modal',
  styleUrls: [('./execution.component.scss')],
  templateUrl: './execution.component.html',
})
export class ExecutionModal implements OnInit {

  chain: any;
  description: any;

  formModel: DynamicFormControlModel[] = [];
  formGroup: FormGroup;

  constructor(
    private activeModal: NgbActiveModal,
    private wpsService: WpsService,
    private formService: DynamicFormService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.wpsService.describeProcess(this.chain.identifier).subscribe(data => {
      this.description = data['wps:ProcessDescriptions'].ProcessDescription[0];
      this.createFrom();
    });
  }

  createFrom() {
    this.createFormControls();
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  createFormControls() {
    const inputs = this.description.DataInputs[0].Input;

    const types = {
      'integer': 'number',
      'string': 'string',
    };

    for (const input of inputs) {
      this.formModel.push(
        new DynamicInputModel({
          id: input['ows:Identifier'][0],
          label: input['ows:Identifier'][0],
          placeholder: input['ows:Title'][0],

          // TODO: For now, its only literal
          inputType: types[input.LiteralData[0]['ows:DataType'][0]._],
        }),
      );
    }

  }

  execute() {
    const inputValues = [];

    for (const input of this.formModel) {
      const imp = this.formService.findById(input.id, this.formModel) as DynamicInputModel;
      inputValues.push({ identifier: input.id, value: imp.value });
    }

    this.wpsService.execute(this.chain.identifier, inputValues).subscribe(data => {
      const statusLocation = data['wps:ExecuteResponse'].$['statusLocation'];

      this.router.navigate(
        ['/pages/chains/' + this.chain.id + '/executions/' + this.getExecutionId(statusLocation)],
      );
    });
    this.closeModal();
  }

  private getExecutionId(statusLocation: string): string {
    const s = statusLocation.split('/');
    return s[s.length - 1].split('.')[0];
  }

  closeModal() {
    this.activeModal.close();
  }
}
