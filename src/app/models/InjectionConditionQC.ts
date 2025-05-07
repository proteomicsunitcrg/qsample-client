import { Instrument } from './Instrument';
import { Method } from './Method';
import { QCtype } from './QCtype';
export class InjectionConditionQC {
  id: number;
  qctype: QCtype;
  instrument: Instrument;
  method: Method;
  volume: number;

  constructor(id: number, qctype: QCtype, instrument: Instrument, method: Method, volume: number) {
    this.id = id;
    this.qctype = qctype;
    this.instrument = instrument;
    this.method = method;
    this.volume = volume;
  }
}
