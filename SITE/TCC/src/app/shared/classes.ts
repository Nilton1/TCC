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
    levelsDescendants: string[][]
    levelsAscendants: string[][]
    name: string

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
        levelsDescendants: string[][],
        levelsAscendants: string[][],
        name: string) {
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
        this.levelsDescendants = levelsDescendants
        this.levelsAscendants = levelsAscendants
        this.name = name
    }
}


export class pesquisador {
    source_id_lattes: string
    target_id_lattes: string
    academic_degree: string
    start_year: string
    conclusion_year: string
    course: string
    institution: string
    thesis: string
    major_area: string
    area: string

    constructor(source_id_lattes: string,
        target_id_lattes: string,
        academic_degree: string,
        start_year: string,
        conclusion_year: string,
        course: string,
        institution: string,
        thesis: string,
        major_area: string,
        area: string) {
        this.source_id_lattes = source_id_lattes
        this.target_id_lattes = target_id_lattes
        this.academic_degree = academic_degree
        this.start_year = start_year
        this.conclusion_year = conclusion_year
        this.course = course
        this.institution = institution
        this.thesis = thesis
        this.major_area = major_area
        this.area = area
    }
}
