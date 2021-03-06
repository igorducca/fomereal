import React, { useEffect, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import $ from 'jquery'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { FiPlus } from "react-icons/fi";

import '../stylesheet/pages/neo-criar.css';
import Sidebar from "../components/sidebar";
import mapIcon from "../utils/mapIcon";
import 'leaflet/dist/leaflet.css'

export default function CreateOrphanage() {

    var [ nome_do_dono, setNomeDoDono ] = useState('')
    var [ nome_da_loja, setNomeDaLoja ] = useState('')

    function clickFileInput() {
        $("#fotoDeBanner").click();
    }

    useEffect(() => {
        axios.get("https://fomereal-server.herokuapp.com/comidas/tipos/list")
        .then(resp => {
            var data = resp.data

            data.forEach(dataEle => {
                var str = `<option value={"${dataEle.tipo}"}>${dataEle.tipo}</option>`

                $("#produtosDaLoja").append(str)
            })
        })
    }, [])

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function addCustomProduct() {
        var produto = document.getElementById("customProductInput").value

        if(produto) {
            axios.post("https://fomereal-server.herokuapp.com/comidas/tipos/adicionar", {
                tipo: produto
            })
            .then(resp => {

                document.getElementById("productHandlerTitle").innerText = `Produto adicionado com sucesso! Recarregando página...`
                document.getElementById("productHandlerTitle").style.color = "green"

                sleep(5000)

                window.location.reload()
            })
        }
        else {
            document.getElementById("productHandlerTitle").innerText = `Você precisa me dizer qual é o seu produto customizado para continuar!`
            document.getElementById("productHandlerTitle").style.color = "red"
        }
    }

    function adicionarLoja() {
        var nome_da_loja = document.getElementById("nomeDaLoja").value
        var horario_de_atendimento = document.getElementById("horarioDeAtendimento").value
        var whats = document.getElementById("numWhats").value
        var foto_de_banner = document.getElementById("imageLink").value
        var descricao = document.getElementById("lojaDesc").value
        var localizacao = document.getElementById("localizacao").value
        var produtosDaLoja = $( "#produtosDaLoja option:selected" ).text();
        var Ndono = document.getElementById("name").value
        var cardapio = document.getElementById("cardapioLink").value

        
        var errorList = "#errorList"

        if(!nome_da_loja) {
            window.scrollTo(0, 0)
            document.getElementById("incaseErrorUl").hidden = false;
            $(errorList).append(`<li>Nome da loja</li>`)
        }

        if(!horario_de_atendimento) {
            window.scrollTo(0, 0)
            document.getElementById("incaseErrorUl").hidden = false;
            $(errorList).append(`<li>Horário de atendimento</li>`)
        }

        if(!whats) {
            window.scrollTo(0, 0)
            document.getElementById("incaseErrorUl").hidden = false;
            $(errorList).append(`<li>Número de whatsapp</li>`)
        }

        if(!foto_de_banner) {
            document.getElementById("incaseErrorUl").hidden = false;
            window.scrollTo(0, 0)
            $(errorList).append(`<li>Foto de banner</li>`)
        }

        
        if(!descricao) {
            document.getElementById("incaseErrorUl").hidden = false;
            window.scrollTo(0, 0)
            $(errorList).append(`<li>Descrição da loja</li>`)
        }

        if(!localizacao) {
            document.getElementById("incaseErrorUl").hidden = false;
            window.scrollTo(0, 0)
            $(errorList).append(`<li>Localização da loja</li>`)
        }

        if(!produtosDaLoja) {
            document.getElementById("incaseErrorUl").hidden = false;
            window.scrollTo(0, 0)
            $(errorList).append(`<li>Produtos vendidos na sua loja</li>`)
        }

        if(!Ndono) {
            document.getElementById("incaseErrorUl").hidden = false;
            window.scrollTo(0, 0)
            $(errorList).append(`<li>Seu nome</li>`)
        }

        if(!cardapio) {
            document.getElementById("incaseErrorUl").hidden = false;
            window.scrollTo(0, 0)
            $(errorList).append(`<li>Foto do cardápio da loja</li>`)
        }

        if(nome_da_loja && horario_de_atendimento && whats && foto_de_banner && descricao && localizacao && produtosDaLoja && Ndono && cardapio) {
            var finalData = {
                nome_da_loja: nome_da_loja,
                nome_do_dono: Ndono,
                atendimento: horario_de_atendimento,
                produto_vendido: produtosDaLoja,
                localizacao: localizacao,
                whats: whats,
                image: foto_de_banner,
                descricao: descricao,
                cardapio: cardapio
            }
    
            axios.post("https://fomereal-server.herokuapp.com/comercios/criar", finalData)
            .then( resp => {
    
                if(resp != null) {
                    sleep(5000)
    
                    window.location.href = `/criar/sucesso?tk=${resp.data.lojaInfo.token}`
                }
            })
        }
    }

  return (
    <body id="createPageMainBody">
        <div id="create-point-page">

            <Sidebar />

            <main>
                <form className="create-orphanage-form">
                    <fieldset>
                    <legend>Dados da sua loja</legend>

                    <fieldset id="incaseErrorUl" hidden>
                        <h2 style={{color:"red"}}>Erro ao criar! Faltando:</h2>

                        <ul style={{color:"red"}}  id="errorList" />
                    </fieldset>

                    <div className="input-block">
                        <label htmlFor="name" style={{marginTop:"15px"}} onChange={ (key) => { setNomeDoDono(key.target.value) } } value={nome_do_dono} >Seu nome (Dono da loja)</label>
                        <input id="name" />
                    </div>

                    <div className="input-block">
                        <label htmlFor="nomeDaLoja" style={{marginTop:"15px"}}>Nome da loja</label>
                        <input id="nomeDaLoja" onChange={ (key) => { setNomeDaLoja(key.target.value) } } value={nome_da_loja} />
                    </div>

                    <div className="input-block">
                        <label htmlFor="about">Explique seu horário de atendimento <span>Máximo de 300 caracteres</span></label>
                        <textarea id="horarioDeAtendimento" maxLength={300} />
                    </div>

                    <div className="input-block">
                        <label htmlFor="numWhats">Número de whatsapp para atendimento (Ex: 7799187587)</label>
                        <input id="numWhats" />
                    </div>

                    <div className="input-block">

                        <div className="uploaded-image">
                        </div>
{/* 
                        <button className="new-image" type="button" id="uploadImageButton" onClick={ clickFileInput }>
                            <FiPlus size={24} color="#dd3636" />
                            <input type="file" style={{display:"none"}} id="fotoDeBanner" accept={"image/png, image/jpeg"} onInput={ (image) => {
                                var imageName = document.getElementById("fotoDeBanner").value
                                document.getElementById("bannerImageTitle").innerText = `Imagem selecionada! Nome da imagem: ${imageName}`
                                handleFile(image)
                            } }/>
                        </button> */}

                        <div className="input-block">
                            <label htmlFor="imageLink">Link de uma imagem para servir como banner</label>
                            <input id="imageLink" />
                        </div>

                        <div className="input-block">
                            <label htmlFor="cardapioLink">Link de uma imagem para servir como cardápio</label>
                            <input id="cardapioLink" />
                        </div>

                        <div style={{display:"flex", justifyContent:"center", marginTop:"15px"}}>
                            <img id="bannerImagePreview" hidden style={{height:"50%", width:"50%"}}/>
                        </div>
                    </div>
                    </fieldset>

                    <fieldset>
                    <legend>Sobre o seu produto</legend>

                    <div className="input-block">
                        <label htmlFor="lojaDesc">Descreva a sua loja (Dê um motivo para as pessoas comprarem com você) </label>
                        <textarea id="lojaDesc" />
                    </div>

                    <div className="input-block">
                        <label htmlFor="localizacao">Ponto de referência para chegar na sua loja <span>Máximo de 300 caracteres</span></label>
                        <textarea id="localizacao" maxLength={300} />
                    </div>

                    <div className="input-block">
                        <label htmlFor="produtosDaLoja">Qual é o produto principal da sua loja?</label>
                        <select id="produtosDaLoja">
                            <option>Selecione algum destes produtos</option>
                        </select>

                        <h4 id="productHandlerTitle">O produto da sua loja não está na lista? <span id="addProduto"><a  style={{cursor:"pointer"}} onClick={ () => {
                            document.getElementById("customProductInput").hidden = false;
                        } }>Adicionar</a></span></h4>
                    </div>

                    <div className="input-block">
                        <input type="text" placeholder="Adicionar produto customizado"  id="customProductInput" hidden onChange = { () => {
                            document.getElementById("addProductButton").hidden = false
                        } }/>

                        <div style={{display:"flex", justifyContent:"center"}}>
                            <button id="addProductButton" hidden onClick={ addCustomProduct } type="button">Adicionar</button>
                        </div>
                    </div>

                    </fieldset>

                    <h2 style={{color:"#36CF82"}}>Fico feliz em te ver participando!</h2>

                    <Link id="finalLinkPath">
                        <button className="confirm-button" type="submit" onClick={ adicionarLoja } type="button">
                            Confirmar
                        </button>
                    </Link>
                </form>
            </main>
        </div>
    </body>
  );
}