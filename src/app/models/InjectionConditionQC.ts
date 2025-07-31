import { Instrument } from './Instrument';
import { Application } from './Application';
import { Method } from './Method';
import { QCtype } from './QCtype';
export class InjectionConditionQC {
  id: number;
  qctype: QCtype;
  instrument: Instrument;
  application: Application;
  method: Method;
  volume: number;

  constructor(
    id: number,
    qctype: QCtype,
    instrument: Instrument,
    application: Application,
    method: Method,
    volume: number
  ) {
    this.id = id;
    this.qctype = qctype;
    this.instrument = instrument;
    this.application = application;
    this.method = method;
    this.volume = volume;
  }
}
