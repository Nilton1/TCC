import { Component, OnInit } from '@angular/core';
import { DadosGrafoService } from 'src/services/dados-grafo.service';
import { NodeDescription } from '../shared/classes';
import ForceGraph, { ForceGraphInstance, LinkObject, NodeObject } from 'force-graph';
import { ResizedEvent } from 'angular-resize-event';
import { first } from 'rxjs';

interface Aresta {
  source: number,
  target: number
}

@Component({
  selector: 'app-researches-trees',
  templateUrl: './researches-trees.component.html',
  styleUrls: ['./researches-trees.component.scss']
})
export class ResearchesTreesComponent implements OnInit {

  InstanciaGrafo: ForceGraphInstance = ForceGraph()

  chaveKey: string[] = ["chave pendente"]
  NovoFirstNode: NodeDescription[] | null = null
  NovoSecondNode: NodeDescription[] | null = null
  listaNodes: NodeDescription[][] | null = null
  FirstNode: NodeDescription | null = null
  SecondNode: NodeDescription | null = null
  FirstNodeAlias: string = ""
  SecondNodeAlias: string = ""

  nivelSelecionado:number=0
  numMaxNiveis:number=0

  NovoFirstNodeFiltrado: NodeDescription[] | null = null
  NovoSecondNodeFiltrado: NodeDescription[] | null = null
  paginas: number[] = []
  listaIdsPermitidos:Number[] = []

  dadosPesquisa: string[][] = []
  dadosPesquisaFiltrado: string[][] = []
  decendente: boolean = true

  firstSelectedNode: string = '10011541'
  //secondSelectedNode : string = '1112919781647346'
  secondSelectedNode: string = '10013485'

  graphDataGlobal: { nodes: NodeObject[], links: LinkObject[] } = {
    nodes: [],
    links: []
  }

  listaNumeros: number[] = []
  listaConexoes: Aresta[] = []

  graphWidth: number = 500
  graphHeight: number = 650
  curPage: number = 1
  numberPags: number = 5
  itemsPerPage: number = 10
  maxSize: number = 5

  curTab: number = 0
  tabAnterior: number = 0



  constructor(private dadosGrado: DadosGrafoService) { }

  ngOnInit(): void {
    //this.ConsultaSimples();


    this.ConsultaNode(this.firstSelectedNode, this.secondSelectedNode)



  }


  changeTab(index: number) {
    if (index != this.curTab) {
      this.curTab = index
      this.curPage = 1
      this.filtering()
    }
  }




  numOfPages() {
    let number = 1
    console.log(`current tab ${this.curTab}`)
    if (this.curTab == -1) {
      if (!this.dadosPesquisa) {
        number = Math.ceil(0 / this.itemsPerPage);
      } else {
        number = Math.ceil(this.dadosPesquisa.length / this.itemsPerPage);
      }
    } else if (this.curTab == 0) {
      if (!this.NovoFirstNode) {
        number = Math.ceil(0 / this.itemsPerPage);
      } else {
        number = Math.ceil(this.NovoFirstNode.length / this.itemsPerPage);
      }
    } else if (this.curTab == 1) {
      if (!this.NovoSecondNode) {
        number = Math.ceil(0 / this.itemsPerPage);
      } else {
        number = Math.ceil(this.NovoSecondNode.length / this.itemsPerPage);
      }
    }
    return number
  }

  selectPage(pag: number) {
    this.curPage = pag
    this.filtering()
  }
  nextPage() {
    this.curPage = this.curPage + 1
    let maxPags = this.numOfPages()
    if (this.curPage >= maxPags) {
      this.curPage = maxPags
    }

    this.filtering()
  }

  prevPage() {
    this.curPage = this.curPage - 1
    if (this.curPage <= 1) {
      this.curPage = 1
    }
    this.filtering()
  }

  filtering() {
    var begin = ((this.curPage - 1) * this.itemsPerPage),
      end = begin + this.itemsPerPage;
    this.paginas = []
    let pagInit = (this.curPage - this.numberPags) < 1 ? 1 : (this.curPage - this.numberPags)
    let maxPags = this.numOfPages()
    let pagEnd = (this.curPage + this.numberPags) > maxPags ? maxPags : (this.curPage + this.numberPags)
    for (let index = pagInit; index <= pagEnd; index++) {
      this.paginas.push(index);

    }
    if (this.curTab == -1) {
      if (this.NovoFirstNode) {
        this.dadosPesquisaFiltrado = this.dadosPesquisa.slice(begin, end);
      } else {
        this.dadosPesquisaFiltrado = []
      }
    } else if (this.curTab == 0) {
      if (this.NovoFirstNode) {
        this.NovoFirstNodeFiltrado = this.NovoFirstNode.slice(begin, end);
      } else {
        this.NovoFirstNodeFiltrado = null
      }
    } else if (this.curTab == 1) {
      if (this.NovoSecondNode) {
        this.NovoSecondNodeFiltrado = this.NovoSecondNode.slice(begin, end);
      } else {
        this.NovoSecondNodeFiltrado = null
      }
    }

  }



  inverter() {
    this.decendente = !this.decendente
    this.ConsultaNode(this.firstSelectedNode, this.secondSelectedNode);
  }
  definirPrimeiro(primeiro: string) {
    this.firstSelectedNode = primeiro
    this.ConsultaNode(this.firstSelectedNode, this.secondSelectedNode);
  }

  definirSegundo(Segundo: string) {
    this.secondSelectedNode = Segundo
    this.ConsultaNode(this.firstSelectedNode, this.secondSelectedNode);

  }

  onResized(event: ResizedEvent): void {
    const grafo = document.getElementById('graph') as HTMLElement;
    grafo.innerHTML = ''
    this.graphWidth = Math.round(event.newRect.width);
    console.log(`Change width ${this.graphWidth}`)
    this.plotGrafo()
    //const Graph = ForceGraph()(grafo).graphData(this.graphDataGlobal).width(this.graphWidth).height(this.graphHeight)


    //this.height = Math.round(event.newRect.height);
  }

  ConsultaSimples() {


    this.dadosGrado.getData().subscribe((result) => {
      console.log(result)
      this.chaveKey = result.valor
    })
  }

  plotGrafo() {


    const grafo = document.getElementById('graph') as HTMLElement;
    let listaPrincipal = [Number(this.FirstNodeAlias), Number(this.SecondNodeAlias)]
    
    console.log(this.listaIdsPermitidos)
    // listaPrincipal.forEach(element => {
    //   if(this.listaIdsPermitidos.includes(String(element.id))){

    //   }
    // });

    this.InstanciaGrafo = ForceGraph()(grafo).nodeLabel('id').nodeColor(d => ((listaPrincipal.includes(Number(d.id))) ? "red" : (this.listaIdsPermitidos.includes(Number(d.id)) ? "blue" : "black")))
      .graphData(this.graphDataGlobal).width(this.graphWidth).height(this.graphHeight)

  }

  selecionaNivel(valor:number){
    this.nivelSelecionado = valor
    this.listaIdsPermitidos = []
    this.FirstNode?.levelsDescendants.forEach((value,index) =>{
      if(index<this.nivelSelecionado){
        this.listaIdsPermitidos = [...this.listaIdsPermitidos, ...value.map(i=>Number(i))]
      }
    });

    this.SecondNode?.levelsDescendants.forEach((value,index) =>{
      if(index<this.nivelSelecionado){
        this.listaIdsPermitidos = [...this.listaIdsPermitidos, ...value.map(i=>Number(i))]
      }
    });
    this.listaIdsPermitidos.push(Number(this.firstSelectedNode))
    this.listaIdsPermitidos.push(Number(this.secondSelectedNode))
    this.plotGrafo()
    
  }

  ConsultaNode(nodeNumberFirst: string, nodeNumberSecond: string) {
    if (this.decendente) {
      console.log("descendente")
      this.dadosGrado.getNode(nodeNumberFirst, nodeNumberSecond).subscribe((result) => {

        this.FirstNodeAlias = nodeNumberFirst
        this.SecondNodeAlias = nodeNumberSecond
        
        this.listaNodes = result
        console.log(this.listaNodes)
        this.listaNumeros = []
        this.listaConexoes = []
        this.listaNumeros.push(Number(nodeNumberFirst))
        this.listaNumeros.push(Number(nodeNumberSecond))
        for (const ListaNovoNode of this.listaNodes) {
          //console.log(ListaNovoNode)
          for (const nodeLocal of ListaNovoNode) {
            for (const x of nodeLocal.directDescendants) {
              console.log(x.origem_id_lattes)
              console.log(x.destino_id_lattes)
              this.listaNumeros.push(Number(x.origem_id_lattes))
              this.listaNumeros.push(Number(x.destino_id_lattes))
              this.listaConexoes.push({
                source: Number(x.origem_id_lattes),
                target: Number(x.destino_id_lattes)
              })
            }
          }
        }

        this.FirstNode = this.listaNodes[0].shift() || null
        this.SecondNode = this.listaNodes[1].shift() || null
        let maxFirst = 0
        let maxSecond = 0
        if(this.FirstNode?.levelsDescendants){
          maxFirst = this.FirstNode.levelsDescendants.length
        }

        if(this.SecondNode?.levelsDescendants){
          maxSecond = this.SecondNode.levelsDescendants.length
        }
        
        this.numMaxNiveis = (maxFirst>maxSecond?maxFirst:maxSecond)
        this.nivelSelecionado = this.numMaxNiveis + 1
        this.NovoFirstNode = this.listaNodes[0]
        this.NovoSecondNode = this.listaNodes[1]

        console.log(this.SecondNode)


        this.graphDataGlobal = {
          nodes: [... new Set(this.listaNumeros)].map(i => ({
            id: i,
          })),
          links: this.listaConexoes.map(id => ({
            source: id.source,
            target: id.target
          }))
        }

        this.plotGrafo()
        this.filtering()

        //console.log(this.NovoNode.ascendant)


      })
    } else {
      console.log("Ascendente")
      this.dadosGrado.getNodeAscendant(nodeNumberFirst, nodeNumberSecond).subscribe((result) => {

        this.FirstNodeAlias = nodeNumberFirst
        this.SecondNodeAlias = nodeNumberSecond

        this.listaNodes = result
        console.log(this.listaNodes)

        this.listaNumeros = []
        this.listaConexoes = []
        this.listaNumeros.push(Number(nodeNumberFirst))
        this.listaNumeros.push(Number(nodeNumberSecond))
        for (const ListaNovoNode of this.listaNodes){
          //console.log(ListaNovoNode)
          for (const nodeLocal of ListaNovoNode) {
            for (const x of nodeLocal.directAscendants) {
              this.listaNumeros.push(Number(x.origem_id_lattes))
              this.listaNumeros.push(Number(x.destino_id_lattes))
              this.listaConexoes.push({
                source: Number(x.origem_id_lattes),
                target: Number(x.destino_id_lattes)
              })
            }
          }
        }

        this.FirstNode = this.listaNodes[0].shift() || null
        this.SecondNode = this.listaNodes[1].shift() || null

        this.NovoFirstNode = this.listaNodes[0]
        this.NovoSecondNode = this.listaNodes[1]

        let maxFirst = 0
        let maxSecond = 0
        if(this.FirstNode?.levelsAscendants){
          maxFirst = this.FirstNode.levelsAscendants.length
        }

        if(this.SecondNode?.levelsAscendants){
          maxSecond = this.SecondNode.levelsAscendants.length
        }
        
        this.numMaxNiveis = (maxFirst>maxSecond?maxFirst:maxSecond)
        this.nivelSelecionado = this.numMaxNiveis + 1
        console.log(this.SecondNode)


        this.graphDataGlobal = {
          nodes: [... new Set(this.listaNumeros)].map(i => ({
            id: i,
          })),
          links: this.listaConexoes.map(id => ({
            source: id.source,
            target: id.target
          }))
        }

        this.plotGrafo()
        this.filtering()

        //console.log(this.NovoNode.ascendant)


      })
    }
  }

  fechar() {
    this.curTab = this.tabAnterior
    console.log(this.curTab)
    this.filtering()
  }

  EncontrarPesquisadores(nome: string) {
    if (nome.trim().length > 2) {
      this.tabAnterior = this.curTab
      this.curTab = -1

      this.dadosGrado.getPesquisa(nome).subscribe((result) => {

        const nomes = result[0]
        const ids = result[1]
        this.dadosPesquisa = []
        nomes.forEach((nome, index) => {
          const idindex = ids[index]
          const novoNome = nome.replace('colaborador', '').trimStart()
          this.dadosPesquisa.push([novoNome, idindex])
        })
        this.filtering()
      })


    }
  }
}
