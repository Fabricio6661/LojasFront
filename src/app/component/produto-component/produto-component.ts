import { Component, OnInit, inject } from '@angular/core';
import { ProdutoService } from '../../services/produto-service';
import { ProdutoModel } from '../../models/produtoModel';
import { FormsModule } from '@angular/forms';
import { LojaModel } from '../../models/lojaModel';
import { CommonModule } from '@angular/common';
import { LojaService } from '../../services/loja-service';

@Component({
  selector: 'app-produto-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './produto-component.html',
  styleUrls: ['./produto-component.css']
})
export class ProdutoComponent implements OnInit {

  private service = inject(ProdutoService);
  private LojaService = inject(LojaService)

  lojas: LojaModel[]=[];
  produtos: ProdutoModel[]=[];
  novoNome = '';
  novoPreco = '';
  novoDescricao = '';
  novaLojaId = '';
  erro = '';
  sucesso = '';
  editarItem : ProdutoModel | null = null;
  

  loading = false;

  ngOnInit(){
    this.carregar();
    this.carregarLojas();
  }

  carregar(){
    this.loading = true;
    this.service.listar()
      //Faz a inscrição para reagir ao resultado do Observable
      .subscribe({
        next: item => {
          this.produtos = item;
          this.loading = false;
        },
        error: e => {
          this.erro = e.message;
          this.loading = false;
        }
      })
  }

  adicionar(){
    this.erro='';
    const precoNum = Number(this.novoPreco);
    if(!this.novoNome.trim()) {
      this.erro = 'Informe o nome'
      return;
    }
    if(!this.novoDescricao.trim()) {
      this.erro = 'Informe a descrição'
      return;
    }
    if(Number.isNaN(precoNum) || precoNum <= 0) {
      this.erro = 'Informe  um preço inválido';
      return;
    }
    if(!this.novaLojaId) {
      this.erro = 'Informe uma Loja';
      return;
    }

    const payload : ProdutoModel={
      id :'',
      nome : this.novoNome,
      descricao : this.novoDescricao,
      preco : precoNum,
      lojaId : this.novaLojaId,
    }

    this.loading = true;
    this.service.adicionar(payload).subscribe({
      next: (p) => {
        this.sucesso = `Produto ${p.nome} salvo com sucesso`;
        this.loading = false;
        this.novoNome = '';
        this.novoDescricao = '';
        this.novoPreco = '';
        this.novaLojaId = '';
        this.carregar();

        setTimeout(() => this.sucesso = '', 3000);
      },
        error: (e) => {
          this.erro = e.message || 'Falha ao salva o produto';
          this.loading = false;
        }
      })
  }


  remover(id: string){
    this.service.remover(id).subscribe({
      next: (msg: string) =>{
        this.sucesso = msg || "Produto removido com sucesso";
        this.carregar();
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: e => {
        this.erro = e.message || "Deu ruim";
      }
    })
  }

  salvarEdicao(){
    if (!this.editarItem?.id){
      return;
    }
    this.loading = true;
    this.service.editar(this.editarItem.id, this.editarItem).subscribe({
      next: result => {
        if(result){
          this.carregar();
          this.sucesso = 'Produto atualizado com sucesso';
          setTimeout(() => this.sucesso = '', 3000);
        }
      },
      error: e => {
        this.erro = e.message || 'Falha ao editar';
      }
    });
  }

  carregarLojas() {
    this.LojaService.listar().subscribe({
      next: item => {
        this.lojas = item;
      },
      error : e => this.erro = e.message
    });
  }

}