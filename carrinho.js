class MyCar{
    constructor(id, name, cupom, date= new Date(), newUser=false){
        this.id=id,
        this.name=name
        this.itens={}
        this.lenghtCar=0
        this.cupom=cupom
        this.total=0
        this.date=date
        this.totalComicao=0
        this.newUser=newUser
    }
    addMultipleProds(list=[]){
        for(let item of list){
            this.addProd(item.id, item.qtd)
        }
    }
    removeMultipleProds(list=[]){
        for(let item of list){
            this.removeProd(item.id, item.qtd)
        }
    }

    addProd(id, qtd) {
        if(!this.itens[id]){
            this.itens[id] = prodsEstoque[id]
            this.itens[id].qtd=0
            this.itens[id].subTotal=0
            this.itens[id].comicao=0
        }
        const auxTotal= prodsEstoque[id].price * qtd
        
        this.lenghtCar+=qtd
        this.total+= auxTotal
        this.itens[id].qtd+=qtd
        this.itens[id].subTotal+= auxTotal

        this.applyMarkentplace(id, auxTotal)
    }

    removeProd(id, qtd) {
        if(!this.itens[id]){
            console.log("nao existe esse produto no carrinho!")
        }else if(this.itens[id].qtd>qtd){
            const auxTotal= prodsEstoque[id].price * qtd
            this.lenghtCar-=qtd
            this.total-= auxTotal
            this.itens[id].qtd-=qtd
            this.itens[id].subTotal-=auxTotal
            this.applyMarkentplace(id, -auxTotal)
        }else{
            // se a quantidade q ele quer remover for maior eu so deixo 0
            const auxLenght = this.itens[id].qtd
            const auxSubTotal = this.itens[id].subTotal
            this.itens[id].qtd = 0
            this.itens[id].subTotal = 0
            this.lenghtCar-=auxLenght
            this.total-= auxSubTotal
            this.applyMarkentplace(id, -auxSubTotal)
            delete this.itens[id]
        }        
    }

    applyMarkentplace(id, total){
        const {porcent} = vendedores[prodsEstoque[id].idVend]
        this.itens[id].comicao += total * (1-porcent)
        this.totalComicao+= total * (1-porcent)
    }
    viewCar(){
        console.log(":::: Dados ::::::::::::::::::::::::::::::::::")
        console.table([{
            id: this.id, name: this.name,
            date: this.date, }])
        console.log(":::: Carrinho :::::::::::::::::::::::::::::")
        console.table(this.itens)
        console.log(":::: Total :::::::::::::::::::::::::::::")
        console.table([{
            lenght: this.lenghtCar, total: this.total,
            // cupom: this.cupom,
            // totalComicao: this.totalComicao,
        }])  
    }
    finalizarCompra(applyCupom=false){
        let auxTotal=this.total
        console.log("====================================")
        this.viewCar()
        if(this.newUser){ 
            console.log(`Você é novo aqui!!! \nDesconto de ${desconto*100}% em qualqur compra!!!`)

            auxTotal-= auxTotal*desconto
        } else if(applyCupom){
            if(this.verifyCupom()){
                console.log(":::: Aplicando cupom ::::::::::::::::::::")
                console.log(`Cupom ${this.cupom} de ${cupons[this.cupom].porcent*100} %`)

                auxTotal-= auxTotal*cupons[this.cupom].porcent
            }else {
                console.log(":::: Cupom inválido!!! ::::::::::::::::::::")
                console.log(`voce nao pode usar esse cupom: ${this.cupom}`)
            }
        }
        console.log(`Total a ser pago: R$ ${auxTotal}`)
        console.log("===========================")
        console.log(":::: Opções Parcelas ::::::::::::::::::::")
        for(let i=12;i>=1;i--){
            console.log(`[${i} parcelas de R$ ${(auxTotal/i).toFixed(2)}]`)
        }

    }
    verifyCupom(){
        if(!cupons[this.cupom])
            return false
        return (this.date<=cupons[this.cupom].dateValid)
    }

}
class Produto{
    constructor(id, name, price, idVend, date){
        this.id=id
        this.name=name
        this.price=price
        this.idVend=idVend
        this.date=date
    }
}

class Vendedor{
    constructor(id, name, porcent){
        this.id=id
        this.name=name
        this.porcent=porcent
    }
}

class Cupom{
    constructor(id, name, porcent, dateValid){
        this.id=id
        this.name=name
        this.porcent=porcent
        this.dateValid=dateValid
    }
}

const desconto=.8

const cupons={
    "Cupom50": new Cupom('0001','Cupom50', .50, new Date('2021-01-20')),
    "Cupom20": new Cupom('0002','Cupom20', .20, new Date('2022-01-01')),
    "Cupom10": new Cupom('0003','Cupom10', .10, new Date('2022-01-01')),
}

const vendedores={
    "001":new Vendedor("001","Marca 01", 0.9),
    "002":new Vendedor("002","Marca 02", 0.87),
    "003":new Vendedor("003","Marca 03", 0.92),
}
const prodsEstoque= {
    "idArroz": new Produto("idArroz", "Arroz", 6.0, "001", new Date("2023-12-12"), ),
    "idFeijao": new Produto("idFeijao", "Feijao", 10.0, "002", new Date("2023-12-12"), ),
    "idAcucar": new Produto("idAcucar", "Acucar", 4.5, "003", new Date("2021-12-12"), ),
    "idMacarrao": new Produto("idMacarrao", "Macarrao", 3.0, "001",new Date("2020-12-12"), ),
    "idCarne": new Produto("idCarne", "Carne", 36.0, "002", new Date("2021-06-12"), ),
    "idOvo": new Produto("idOvo", "Ovo", 0.5, "003", new Date("2021-12-12"), ),
}
const carrinho= new MyCar("00001", "Jeferson",'Cupom10', new Date(), false)

// carrinho.addProd('idArroz',5)
// carrinho.addProd('idCarne',1)
// carrinho.removeProd("idArroz",4)
// carrinho.addProd('idMacarrao',2)
// carrinho.addProd('idFeijao',1)
// carrinho.addMultipleProds([{id:'idArroz',qtd: 2},{id:'idAcucar',qtd: 2},{id:'idFeijao',qtd: 2},])
carrinho.addProd('idFeijao',10)
carrinho.finalizarCompra(true)