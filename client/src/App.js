import React, { Component } from "react";
import Auction from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";
import './css/skeleton.css';
import './css/normalize.css';

import "./App.css";

class App extends Component {
  state = { winner: [], topBid: 0, yourBid: 0, saleList: [], registeredSale: ["","","","",""], currentState: null, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Auction.networks[networkId];
      const instance = new web3.eth.Contract(
        Auction.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  StartAuction = async () => {
    const { accounts, contract } = this.state;

    var _rawState = await contract.methods.startAuction().send({ from: accounts[0]});

    let msg = "";
    switch(_rawState){
      case "0":
        msg = "Enchères pas encore commencées.";
        break;
      case "1":
        msg =  "Enchères en cours.";
        break;
      case "2":
        msg =  "Enchères terminées.";
        break;
    }
    this.setState({ currentState: msg });
  }

  EndAuction = async () => {
    const { accounts, contract } = this.state;

    var _rawState = await contract.methods.endAuction().send({ from: accounts[0]});

    let msg = "";
    switch(_rawState){
      case "0":
        msg = "Enchères pas encore commencées.";
        break;
      case "1":
        msg =  "Enchères en cours.";
        break;
      case "2":
        msg =  "Enchères terminées.";
        break;
    }
    this.setState({ currentState: msg });
  }

  ViewCurrentState = async () => {
    const { contract } = this.state;

    var _rawState = await contract.methods.showCurrentState().call();

    let msg = "";
    switch(_rawState){
      case "0":
        msg = "Enchères pas encore commencées.";
        break;
      case "1":
        msg =  "Enchères en cours.";
        break;
      case "2":
        msg =  "Enchères terminées.";
        break;
    }
    this.setState({ currentState: msg });
  }

  RegisterAdmin = async () => {
    const { accounts, contract } = this.state;

    var _user = document.getElementById('adminAdressInput').value;

    await contract.methods.registerAdmin(_user).send({ from: accounts[0]});
  }

  RegisterBidder = async () => {
    const { accounts, contract } = this.state;

    var _user = document.getElementById('bidderAdressInput').value;

    await contract.methods.registerBidder(_user).send({ from: accounts[0]});
  }

  ProposeSale = async () => {
    const { accounts, contract } = this.state;

    var _name = document.getElementById('nameSaleInput').value;
    var _description = document.getElementById('descriptionSaleInput').value;
    var _image = document.getElementById('imageSaleInput').value;
    var _price = document.getElementById('priceSaleInput').value;

    var sale = await contract.methods.proposeSale(_name, _description, _image, _price).send({ from: accounts[0]});
    console.log(sale.events.newSale.returnValues);
  }

  ViewPendingSales = async () => {
    const { contract } = this.state;

    var _saleList = await contract.methods.viewPendingSales().call();
    console.log(_saleList);
    this.setState({ saleList: _saleList });
  }

  ViewRegisteredSale = async () => {
    const { contract } = this.state;

    var _registeredSale = await contract.methods.viewRegisteredSale().call();
    console.log(_registeredSale);
    this.setState({ registeredSale: _registeredSale });
  }

  AcceptSale = async () => {
    const { accounts, contract } = this.state;

    var _sellerAdress = document.getElementById('acceptSaleSellerAddrInput').value;

    await contract.methods.acceptSale(_sellerAdress).send({ from: accounts[0]});
  }

  Bid = async () => {
    const { accounts, contract } = this.state;

    var _amount = document.getElementById('bidAmountInput').value;

    await contract.methods.bid().send({ from: accounts[0], value: _amount });
  }

  ViewYourBid = async () => {
    const { contract } = this.state;

    var _yourBid = await contract.methods.viewYourBid().call();
    this.setState({ yourBid: _yourBid });
  }

  ViewBestBid = async () => {
    const { contract } = this.state;

    var _topBid = await contract.methods.viewBestBid().call();
    this.setState({ topBid: _topBid });
  }

  ViewResults = async () => {
    const { contract } = this.state;

    var _winner = await contract.methods.viewResults().call();
    console.log(_winner)
    this.setState({ winner: [_winner[0], _winner[1]] });
  }

  BuyerWithdrawCredits = async () => {
    const { accounts, contract } = this.state;

    var response = await contract.methods.buyerWithdrawCredits().send({ from: accounts[0]});
    console.log(response);
  }

  SellerWithdrawCredits = async () => {
    const { accounts, contract } = this.state;

    var response = await contract.methods.sellerWithdrawCredits().send({ from: accounts[0]});
    console.log(response);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div class="container">
          <h2>Enregistrer un administrateur</h2>
          <label for="adminAdressInput">Adresse utilisateur:</label>
          <input id='adminAdressInput'></input>
          <br /><br />
          <button class="button-primary" onClick={this.RegisterAdmin}>
          Ajouter
          </button>
          <br /><br />

          <h2>Enregistrer un enchérisseur</h2>
          <label for="bidderAdressInput">Adresse utilisateur:</label>
          <input id='bidderAdressInput'></input>
          <br /><br />
          <button class="button-primary" onClick={this.RegisterBidder}>
          Ajouter
          </button>
          <br /><br />
          <hr></hr>

          <h2>Gestion de la session</h2>
          <br />
          <button class="button-primary" onClick={this.StartAuction}>
            Démarrer les enchères
          </button>
          <br /><br />
          <button class="button-primary" onClick={this.EndAuction}>
            Mettre fin aux enchères
          </button>
          <br /><br />

          <h4>Etat de la session</h4>
          <button class="button-primary" onClick={this.ViewCurrentState}>
          Voir etat
          </button>
          <div>{this.state.currentState}</div>
          <hr></hr>

          <h2>Soumettre une proposition de vente</h2>
          <label for="nameSaleInput">Nom:</label>
          <input id='nameSaleInput'></input>
          <label for="descriptionSaleInput">Description:</label>
          <input id='descriptionSaleInput'></input>
          <label for="imageSaleInput">Image:</label>
          <input id='imageSaleInput'></input>
          <label for="priceSaleInput">Prix:</label>
          <input id='priceSaleInput'></input>
          <br /><br />
          <button class="button-primary" onClick={this.ProposeSale}>
          Ajouter
          </button>
          <br /><br />

          <h2>Liste propositions de ventes</h2>
          <button class="button-primary" onClick={this.ViewPendingSales}>
            Afficher la liste des propositions
          </button>
          <hr></hr>
          <div>
            {
              this.state.saleList.map((sale) => (
                <div>
                <li><b>Vendeur:</b> {sale[0]}</li>
                <li><b>Nom:</b> {sale[1]}</li>
                <li><b>Description:</b> {sale[2]}</li>
                <li><b>Image:</b> </li>
                <img src={sale[3]} width="500" height="300"></img>
                <li><b>Prix:</b> {sale[4]}</li>
                <hr></hr>
                </div>
                
              ))
            }
          </div>
          <br /><br />

          <h2>Accepter une proposition de vente</h2>
          <label for="acceptSaleSellerAddrInput">Adresse du vendeur:</label>
          <input id='acceptSaleSellerAddrInput'></input>
          <br /><br />
          <button class="button-primary" onClick={this.AcceptSale}>
          Accepter
          </button>
          <br /><br />
          <hr></hr>

          <h2>Enchères</h2>
          <div>
          <button class="button-primary" onClick={this.ViewRegisteredSale}>
          Voir produit
          </button>
          {this.state.registeredSale != null &&
          <div>
          <li><b>Vendeur:</b> {this.state.registeredSale[0]}</li>
          <li><b>Nom:</b> {this.state.registeredSale[1]}</li>
          <li><b>Description:</b> {this.state.registeredSale[2]}</li>
          <li><b>Image:</b> </li>
          <img src={this.state.registeredSale[3]} width="500" height="300"></img>
          <li><b>Prix:</b> {this.state.registeredSale[4]}</li>
          <hr></hr>
          </div>
          }
          </div>
  
          <label for="bidAmountInput">Montant de l'enchère:</label>
          <input id='bidAmountInput'></input>
          <br />
          <br />
          <button class="button-primary" onClick={this.Bid}>
            Payer
          </button>
          <br /><br />
          <button class="button-primary" onClick={this.BuyerWithdrawCredits}>
            Retirer mon enchère
          </button>

          <h4>Votre enchère</h4>
          <button class="button-primary" onClick={this.ViewYourBid}>
          Voir votre enchère
          </button>
          <div>{this.state.yourBid}</div>

          <h4>Meilleure enchère actuelle</h4>
          <button class="button-primary" onClick={this.ViewBestBid}>
          Voir meilleure enchère
          </button>
          <div>{this.state.topBid}</div>
          <hr></hr>

          <h2>Résultats</h2>
          <button class="button-primary" onClick={this.ViewResults}>
          Afficher le gagnant
          </button>
          <br /><br />
          <div>{this.state.winningProposal}</div>
          <div>
            <li><b>Gagnant:</b> {this.state.winner[0]}</li>
            <li><b>Somme payée:</b> {this.state.winner[1]}</li>
          </div>
          <hr></hr>

          <h2>Vendeur</h2>
          <button class="button-primary" onClick={this.SellerWithdrawCredits}>
            Récupérer mes gains
          </button>
          <br /><br />
        </div>
      </div>
    );
  }
}

export default App;
