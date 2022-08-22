export class valor {
    valor: string[]

    constructor(valor: string[]) {
        this.valor = valor
    }
}


export class NodeDescription {
    directDescendants: pesquisador[]
    descendant: string[]
    directDescendantsNumber: number
    numberDescendantLeafs: number
    directAscendants: pesquisador[]
    ascendant: string[]
    directAscendantsNumber: number
    numberAscendantLeafs: number
    

    widthDescendantsNumber: number
    widthAscendantsNumber: number
    depthDescendant: number
    depthAscendant: number
    fertilityDescendant: number
    fertilityAscendant: number
    fertilityWeightedDescendant: number
    fertilityWeightedAscendant: number
    levelsDescendants: string[][]
    levelsAscendants: string[][]
    greaterWidthDescendant: number
    greaterWidthAscendant: number
    name: string
    id:string
    color:string = "black"

    constructor(directDescendants: pesquisador[],
        descendant: string[],
        directDescendantsNumber: number,
        numberDescendantLeafs: number,
        directAscendants: pesquisador[],
        ascendant: string[],
        directAscendantsNumber: number,
        numberAscendantLeafs: number,
        widthDescendantsNumber: number,
        widthAscendantsNumber: number,
        depthDescendant: number,
        depthAscendant: number,
        fertilityDescendant: number,
        fertilityAscendant: number,
        fertilityWeightedDescendant: number,
        fertilityWeightedAscendant: number,
        levelsDescendants: string[][],
        levelsAscendants: string[][],
        greaterWidthDescendant: number,
        greaterWidthAscendant: number,
        name: string,
        id:string) {
        this.directDescendants = directDescendants
        this.descendant = descendant
        this.directDescendantsNumber = directDescendantsNumber
        this.numberDescendantLeafs = numberDescendantLeafs

        this.directAscendants = directAscendants
        this.ascendant = ascendant
        this.directAscendantsNumber = directAscendantsNumber
        this.numberAscendantLeafs = numberAscendantLeafs

        this.widthDescendantsNumber = widthDescendantsNumber
        this.widthAscendantsNumber = widthAscendantsNumber
        this.depthDescendant = depthDescendant
        this.depthAscendant = depthAscendant
        this.fertilityDescendant = fertilityDescendant
        this.fertilityAscendant = fertilityAscendant
        this.fertilityWeightedDescendant = fertilityWeightedDescendant
        this.fertilityWeightedAscendant = fertilityWeightedAscendant
        this.levelsDescendants = levelsDescendants
        this.levelsAscendants = levelsAscendants
        this.greaterWidthDescendant = greaterWidthDescendant
        this.greaterWidthAscendant = greaterWidthAscendant
        this.name = name
        this.id = id
    }

    
}


export class pesquisador {
    origem_id_lattes: string
    destino_id_lattes: string
    ano_inicio: string
    ano_conclusao: string
    curso: string
    instituicao: string
    tese: string
    grande_area: string
    area: string
    tipo_orientacao:string
    titulacao: string

    constructor(origem_id_lattes: string,
        destino_id_lattes: string,
        ano_inicio: string,
        ano_conclusao: string,
        curso: string,
        instituicao: string,
        tese: string,
        grande_area: string,
        area: string,
        tipo_orientacao:string,
        titulacao: string) {
        this.origem_id_lattes = origem_id_lattes
        this.destino_id_lattes = destino_id_lattes
        this.ano_inicio = ano_inicio
        this.ano_conclusao = ano_conclusao
        this.curso = curso
        this.instituicao = instituicao
        this.tese = tese
        this.grande_area = grande_area
        this.area = area
        this.tipo_orientacao = tipo_orientacao
        this.titulacao = titulacao
    }
}
