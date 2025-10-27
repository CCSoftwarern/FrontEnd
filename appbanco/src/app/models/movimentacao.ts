export class Movimentacao {
    constructor(
        public BeneficiarioID: number,
        public CorrentistaID: number,
        public DataOperacao: Date,
        public Descricao: string,
        public MovimentacaoID: number,
        public NomeBeneficiario: string,
        public NomeCorrentista: string,
        public TipoOperacao: string,
        public ValorOperacao: number
    ) {}
   
}

