import { Component, OnInit } from '@angular/core';
import { DadosGrafoService } from 'src/services/dados-grafo.service';
import { NodeDescription } from '../shared/classes';
import ForceGraph, { LinkObject, NodeObject } from 'force-graph';
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

  chaveKey: string[] = ["chave pendente"]
  NovoFirstNode: NodeDescription[] | null = null
  NovoSecondNode: NodeDescription[] | null = null
  listaNodes: NodeDescription[][] | null = null
  FirstNode: NodeDescription | null = null
  SecondNode: NodeDescription | null = null
  FirstNodeAlias: string = ""
  SecondNodeAlias: string = ""

  firstSelectedNode : string = '10011541'
  secondSelectedNode : string = '1112919781647346'

  graphDataGlobal: { nodes: NodeObject[], links: LinkObject[] } = {
    nodes: [],
    links: []
  }

  listaNumeros: number[] = []
  listaConexoes: Aresta[] = []

  graphWidth: number = 500
  graphHeight: number = 650


  constructor(private dadosGrado: DadosGrafoService) { }

  ngOnInit(): void {
    //this.ConsultaSimples();


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
    let listaPrincipal = [Number(this.FirstNodeAlias) , Number(this.SecondNodeAlias)]

    const Graph = ForceGraph()(grafo).nodeColor(d =>  ((listaPrincipal.includes( Number(d.id))) ? "red":"blue") )
                .graphData(this.graphDataGlobal).width(this.graphWidth).height(this.graphHeight)

  }

  ConsultaNode(nodeNumberFirst: string, nodeNumberSecond: string) {
    this.dadosGrado.getNode(nodeNumberFirst, nodeNumberSecond).subscribe((result) => {
      console.log(result)
      this.FirstNodeAlias = nodeNumberFirst
      this.SecondNodeAlias = nodeNumberSecond

      this.listaNodes = result
      
      
      this.listaNumeros.push(Number(nodeNumberFirst))
      this.listaNumeros.push(Number(nodeNumberSecond))
      for (const ListaNovoNode of this.listaNodes) {
        console.log(ListaNovoNode)
        for (const nodeLocal of ListaNovoNode) {
          for (const x of nodeLocal.directDescendants) {
            this.listaNumeros.push(Number(x.source_id_lattes))
            this.listaNumeros.push(Number(x.target_id_lattes))
            this.listaConexoes.push({
              source: Number(x.source_id_lattes),
              target: Number(x.target_id_lattes)
            })
          }
        }
      }

      this.FirstNode = this.listaNodes[0].shift() || null
      this.SecondNode = this.listaNodes[1].shift() || null

      this.NovoFirstNode = this.listaNodes[0]
      this.NovoSecondNode = this.listaNodes[1]

      console.log(this.SecondNode)

      
      this.graphDataGlobal = {
        nodes: [... new Set(this.listaNumeros)].map(i => ({ id: i ,
          })),
        links: this.listaConexoes.map(id => ({
          source: id.source,
          target: id.target
        }))
      }

      this.plotGrafo()


      //console.log(this.NovoNode.ascendant)


    })
  }
}
