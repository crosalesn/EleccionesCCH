export interface IRuta {
    destino?: string;
    regionOrigen: number;
    comumaOrigen: number;
    regionDestino: number;
    comumaDestino: number;   
    tipoLugarOrigen: number;
    tipoLugarDestino: number 
    codigos: string[];
    estado: number;
    usuario?: any;
    
}