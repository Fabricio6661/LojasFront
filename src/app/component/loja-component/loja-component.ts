import { Component, OnInit, inject } from '@angular/core';
import { LojaService } from '../../services/loja-service';
import { FormsModule } from '@angular/forms';
import { LojaModel } from '../../models/lojaModel';

@Component({
  selector: 'app-loja-component',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './loja-component.html',
  styleUrls: ['./loja-component.css']
})
export class LojaComponent implements OnInit {

  private service = inject(LojaService);


  lojas: LojaModel[]=[];
  novoNome = '';
  novoEndereco = '';
  novoCnpj = '';
  erro = '';
  sucesso = '';
  editarItem : LojaModel | null = null;

  loading = false;

  ngOnInit(){
    this.carregar();
  }

  carregar(){
    this.loading = true;
    this.service.listar()
      //Faz a inscrição para reagir ao resultado do Observable
      .subscribe({
        next: item => {
          this.lojas = item;
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
    if(!this.novoNome.trim()) {
      this.erro = 'Informe o nome'
      return;
    }
    if(!this.novoEndereco.trim()) {
      this.erro = 'Informe o endereço'
      return;
    }
    if(!this.novoCnpj.trim()) {
      this.erro = 'Informe o CNPJ'
      return;
    }
    const payload : LojaModel={
      id :'',
      nome : this.novoNome,
      endereco : this.novoEndereco,
      cnpj : this.novoCnpj
    }

    this.loading = true;
    this.service.adicionar(payload).subscribe({
      next: (p) => {
        this.sucesso = `Loja ${p.nome} salvo com sucesso`;
        this.loading = false;
        this.novoNome = '';
        this.novoCnpj = '';
        this.novoEndereco = '';
        this.carregar();

        setTimeout(() => this.sucesso = '', 3000);
      },
        error: (e) => {
          this.erro = e.message || 'Falha ao salvar Loja';
          this.loading = false;
        }
      })
  }


  remover(id: string){
    this.service.remover(id).subscribe({
      next: (msg: string) =>{
        this.sucesso = msg || "Loja removido com sucesso";
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
          this.sucesso = 'Loja atualizado com sucesso';
          setTimeout(() => this.sucesso = '', 3000);
        }
      },
      error: e => {
        this.erro = e.message || 'Falha ao editar';
      }
    });
  }
}

