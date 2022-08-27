import { Component, OnInit } from '@angular/core';
import { DadosGrafoService } from 'src/services/dados-grafo.service';
import { NodeDescription } from '../shared/classes';
import ForceGraph, { ForceGraphInstance, LinkObject, NodeObject } from 'force-graph';
import { ResizedEvent } from 'angular-resize-event';
import { first, of } from 'rxjs';
import { __values } from 'tslib';

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

  pesquisaGrafo: string = ""
  highlightNodes = new Set();
  highlightLinks = new Set();
  listaPesquisaGrafo = new Set()
  listaSemelhantes = new Set()
  hoverNode: NodeObject | null = null;

  InstanciaGrafo: ForceGraphInstance = ForceGraph()

  listaPrincipal: number[] = []
  chaveKey: string[] = ["chave pendente"]
  NovoFirstNode: NodeDescription[] | null = null
  NovoSecondNode: NodeDescription[] | null = null
  listaNodes: NodeDescription[][] | null = null
  FirstNode: NodeDescription | null = null
  SecondNode: NodeDescription | null = null
  FirstNodeAlias: string = ""
  SecondNodeAlias: string = ""

  nivelSelecionado: number = 0
  numMaxNiveis: number = 0

  NovoFirstNodeFiltrado: NodeDescription[] | null = null
  NovoSecondNodeFiltrado: NodeDescription[] | null = null
  paginas: number[] = []
  listaIdsPermitidos: Number[] = []
  numeroVertices: number = 0
  allObjs: NodeDescription[] = []

  dadosPesquisa: string[][] = []
  dadosPesquisaFiltrado: string[][] = []
  descendente: boolean = true

  firstSelectedNode: string = '7106042485461671'
  //secondSelectedNode : string = '10011541'
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

  impacto(node: string[] | undefined | null): number {

    if (node) {
      return node.length / (this.listaIdsPermitidos.length + 2);
    } else {
      return 0
    }
  }

  conexoesDiretas(diretos: string[][]| null | undefined): number {

    if (diretos && diretos.length>0) {
      return diretos[0].length;
    } else {
      return 0
    }
  }

  inverter() {
    this.descendente = !this.descendente
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
    this.listaPrincipal = [Number(this.FirstNodeAlias), Number(this.SecondNodeAlias)]




    //.cooldownTime(20000)
    //.d3AlphaDecay(0.001)
    //.d3VelocityDecay(0.05)



    this.InstanciaGrafo = ForceGraph()(grafo).nodeRelSize(20)
      .d3AlphaDecay(0.002)
      .d3VelocityDecay(0.02)
      .cooldownTime(60000)
      .linkColor(() => 'rgba(0,0,0,0.5)')
      .zoom(0.20).width(this.graphWidth).height(this.graphHeight)
      .nodeLabel(node => ("" + (this.allObjs.find((item) => Number(item.id) == node.id)?.name))).graphData(this.graphDataGlobal)
      .onNodeHover(node => {
        this.highlightNodes.clear();
        this.highlightLinks.clear();

        if (node) {
          //this.highlightNodes.add(node);
          this.graphDataGlobal.links.forEach(link => {

            if (link.source === node) {
              this.highlightLinks.add(link)
              this.highlightNodes.add(link.target)

            }
          }
          );
        }

        this.hoverNode = node || null;
      })
      .onLinkHover(link => {
        this.highlightNodes.clear();
        this.highlightLinks.clear();

        if (link) {
          this.highlightLinks.add(link);
          this.highlightNodes.add(link.source);
          this.highlightNodes.add(link.target);
        }
      })
      .autoPauseRedraw(false) // keep redrawing after engine has stopped
      .linkWidth(link => this.highlightLinks.has(link) ? 8 : 1)
      .linkDirectionalParticles(4)
      .linkDirectionalArrowLength(15)
      .linkDirectionalParticleWidth(link => this.highlightLinks.has(link) ? 4 : 0)

      .nodeCanvasObject((node, ctx) => {
        this.nodePaint(node, (
          (node === this.hoverNode) ? "green" :
            (this.highlightNodes.has(node)) ? "dodgerblue" : ("" + (this.allObjs.find((item) => Number(item.id) == node.id)?.color))
          //((const vari  =this.allObjs.find((item) => Number(item.id) == node.id)) ? vari.color)

          //(this.allObjs.find((item) => Number(item.id) == node.id)?.color)
          // (this.listaPesquisaGrafo.has(node.id)) ? "orange" :
          //   (this.listaSemelhantes.has(node.id)) ? "whitegreen" :

          //         (this.listaPrincipal.includes(Number(node.id))) ? "red" :
          //           (this.listaIdsPermitidos.includes(Number(node.id)) ? "blue" : "black")

        ), ctx)
      }
      )
      .nodePointerAreaPaint(this.nodePaint)

    this.InstanciaGrafo.d3Force('center')?.['strength'](0.4)
    this.InstanciaGrafo.d3Force('link')?.['distance'](150.50)
    this.InstanciaGrafo.d3Force('link')?.['strength'](0.15)
    this.InstanciaGrafo.d3Force('collide')?.['distance'](30)
    this.InstanciaGrafo.d3Force('collide')?.['strength'](4)



  }

  radiusForce() {
    return 1;
  }



  nodePaint(node: NodeObject, color: string, ctx: CanvasRenderingContext2D) {
    if ((node.x) && (node.y)) {

      ctx.fillStyle = color;
      ctx.beginPath();
      if (color == 'red') {
        ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI, false);
      } else if (color == 'green' || color == 'whitegreen') {
        ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI, false);
      } else if (color == 'blue') {
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI, false);
      } else if (color == 'dodgerblue') {
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI, false);
      } else {
        ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI, false);
      }

      // const label = '1234567890';
      // const fontSize = 20 ;
      // ctx.font = `${fontSize}px Sans-Serif`;
      // ctx.textAlign = 'center';
      // ctx.textBaseline = 'middle';


      if (color == 'orange') {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#F39C12';
      } else if (color == 'whitegreen') {
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#99ff99';
      } else if (color == 'green') {
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#00a171';
      } else if (color == 'dodgerblue') {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#1E90FF';
      } else {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#003300';
      }
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#003300';
      //ctx.fillText(label, node.x, node.y);
    }
  }

  selecionaNivel(valor: number) {
    this.nivelSelecionado = valor
    this.listaIdsPermitidos = []
    if (this.descendente) {
      this.FirstNode?.levelsDescendants.forEach((value, index) => {
        if (index < this.nivelSelecionado) {
          this.listaIdsPermitidos = [...this.listaIdsPermitidos, ...value.map(i => Number(i))]
        }
      });

      this.SecondNode?.levelsDescendants.forEach((value, index) => {
        if (index < this.nivelSelecionado) {
          this.listaIdsPermitidos = [...this.listaIdsPermitidos, ...value.map(i => Number(i))]
        }
      });
    } else {
      this.FirstNode?.levelsAscendants.forEach((value, index) => {
        if (index < this.nivelSelecionado) {
          this.listaIdsPermitidos = [...this.listaIdsPermitidos, ...value.map(i => Number(i))]
        }
      });

      this.SecondNode?.levelsAscendants.forEach((value, index) => {

        if (index < this.nivelSelecionado) {
          this.listaIdsPermitidos = [...this.listaIdsPermitidos, ...value.map(i => Number(i))]
        }
      });
    }
    this.listaIdsPermitidos.push(Number(this.firstSelectedNode))
    this.listaIdsPermitidos.push(Number(this.secondSelectedNode))
    this.plotGrafo()

  }
  filtrarGrafoInput() {
    this.listaPesquisaGrafo.clear()
    if (this.pesquisaGrafo.trim().length > 0) {
      if (this.SecondNode?.name.toLowerCase().includes(this.pesquisaGrafo.toLowerCase())) {
        this.listaPesquisaGrafo.add(Number(this.SecondNode?.id))
      }

      if (this.FirstNode?.name.toLowerCase().includes(this.pesquisaGrafo.toLowerCase())) {
        this.listaPesquisaGrafo.add(Number(this.FirstNode?.id))
      }

      this.NovoFirstNode?.forEach((node, index) => {
        if (node.name.toLowerCase().includes(this.pesquisaGrafo.toLowerCase())) {
          this.listaPesquisaGrafo.add(Number(node.id))
        }
      });

      this.NovoSecondNode?.forEach((node, index) => {
        if (node.name.toLowerCase().includes(this.pesquisaGrafo.toLowerCase())) {
          this.listaPesquisaGrafo.add(Number(node.id))
        }
      });
    }
    console.log(this.listaPesquisaGrafo)
  }

  ConsultaNode(nodeNumberFirst: string, nodeNumberSecond: string) {
    this.pesquisaGrafo = ""
    this.listaSemelhantes.clear()
    if (this.descendente) {
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
              this.listaNumeros.push(Number(x.origem_id_lattes))
              this.listaNumeros.push(Number(x.destino_id_lattes))
              this.listaConexoes.push({
                source: Number(x.origem_id_lattes),
                target: Number(x.destino_id_lattes)
              })
            }
          }
        }

        const first = this.listaNodes[0].shift() || null
        const second = this.listaNodes[1].shift() || null

        this.FirstNode = first
        this.SecondNode = second


        let maxFirst = 0
        let maxSecond = 0

        if (this.FirstNode?.levelsDescendants) {
          maxFirst = this.FirstNode.levelsDescendants.length
        }

        if (this.SecondNode?.levelsDescendants) {
          maxSecond = this.SecondNode.levelsDescendants.length
        }

        this.NovoFirstNode = this.listaNodes[0]
        this.NovoSecondNode = this.listaNodes[1]

        this.numMaxNiveis = (maxFirst > maxSecond ? maxFirst : maxSecond)
        this.selecionaNivel(this.numMaxNiveis)
        this.nivelSelecionado = this.numMaxNiveis



        const RaizesIguais = this.FirstNode?.descendant.filter(value => this.SecondNode?.descendant.includes(value))
        console.log(RaizesIguais)
        
        RaizesIguais?.forEach(item => this.listaSemelhantes.add(Number(item)))
        console.log(this.listaSemelhantes)


        let listaNumerosSet = new Set(this.listaNumeros)
        this.numeroVertices = listaNumerosSet.size + 2

        this.graphDataGlobal = {
          nodes: [...listaNumerosSet].map(i => ({
            id: i
          })),
          links: this.listaConexoes.map(id => ({
            source: id.source,
            target: id.target
          }))
        }
        this.filtering()
        this.coloring()
        this.plotGrafo()


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
        for (const ListaNovoNode of this.listaNodes) {
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
        if (this.FirstNode?.levelsAscendants) {
          maxFirst = this.FirstNode.levelsAscendants.length
        }

        if (this.SecondNode?.levelsAscendants) {
          maxSecond = this.SecondNode.levelsAscendants.length
        }

        this.numMaxNiveis = (maxFirst > maxSecond ? maxFirst : maxSecond)
        this.selecionaNivel(this.numMaxNiveis)
        this.nivelSelecionado = this.numMaxNiveis

        const RaizesIguais = this.FirstNode?.ascendant.filter(value => this.SecondNode?.ascendant.includes(value))

        RaizesIguais?.forEach(item => this.listaSemelhantes.add(Number(item)))

        let listaNumerosSet = new Set(this.listaNumeros)
        this.numeroVertices = listaNumerosSet.size + 2
        this.graphDataGlobal = {
          nodes: [...listaNumerosSet].map(i => ({
            id: i,
          })),
          links: this.listaConexoes.map(id => ({
            source: id.source,
            target: id.target
          }))
        }

        this.filtering()
        this.coloring()
        this.plotGrafo()


        //console.log(this.NovoNode.ascendant)


      })
    }


  }


  coloring() {
    this.allObjs = []
    if (this.FirstNode) {
      this.allObjs.push(this.FirstNode)
    }
    if (this.SecondNode) {
      this.allObjs.push(this.SecondNode)
    }
    if (this.listaNodes) {


      for (const node of this.listaNodes) {
        
        this.allObjs = this.allObjs.concat(node)
      }
    }

    this.allObjs.forEach(item => {
      (this.listaPesquisaGrafo.has(Number(item.id))) ? item.color = "orange" :
        (this.listaSemelhantes.has(Number(item.id))) ? item.color = "whitegreen" :
          (this.listaPrincipal.includes(Number(item.id))) ? item.color = "red" :
            (this.listaIdsPermitidos.includes(Number(item.id)) ? item.color = "blue" : item.color = "black")
    });
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
