import { IRegion } from './region.interface';
import { ITipoLugar } from './tipo_lugar.interface';
import { ILugar } from './lugar.interface';

export interface IRuta {
    id: string;
    destino?: string;
    regionOrigen: IRegion;
    comumaOrigen: any;
    regionDestino: IRegion;
    comumaDestino: any;
    tipoLugarOrigen: ITipoLugar;
    tipoLugarDestino: ITipoLugar;
    lugarOrigen: ILugar;
    lugarDestino: ILugar;
    codigos: string[];
    estado: number;
    usuario?: any;
}