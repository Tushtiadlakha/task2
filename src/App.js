import React, {Component} from 'react';
import axios from 'axios';
import {Button, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

class App extends Component {
  state = {
    servers: [],
    newServerModal: false,
    delServerModal: false,
    findServerByIdModal: false,
    findServerByNameModal: false,
    newServerObject: {
      id: '',
      name: '',
      language: '',
      framework: ''
    },
    serverId: '',
    serverName: ''
  }
  componentWillMount() {
    this.__refreshServersCollection();
    toast.configure({
      autoClose: 4000,
      draggable: false,
    });
  }
  __refreshServersCollection() {
    axios.get('http://127.0.0.1:8080/servers/getServer').then((response) => {
      this.setState({
        servers: response.data
      })
    });
  }
  toggleNewServerModal() {
    this.setState({
      newServerModal: ! this.state.newServerModal
    });
  }
  toggleDelServerModal() {
    this.setState({
      delServerModal: ! this.state.delServerModal
    });
  }
  toggleFindServerByIdModal() {
    this.setState({
      findServerByIdModal: ! this.state.findServerByIdModal
    });
  }
  toggleFindServerByNameModal() {
    this.setState({
      findServerByNameModal: ! this.state.findServerByNameModal
    });
  }
  handleChangeId(event) {
    this.setState({serverId: event.target.value});
  }
  handleChangeName(event) {
    this.setState({serverName: event.target.value});
  }
  createServer() {
    axios.put('http://127.0.0.1:8080/servers/createServer', this.state.newServerObject).then((response) => {
    let {servers} = this.state;
    servers.push(this.state.newServerObject);
    this.setState({servers, newServerModal: false, newServerObject: {
      id: '',
      name: '',
      language: '',
      framework: ''
    }});
    toast.success(response.data);
    });
  }
  deleteServer(id) {
    axios.delete('http://127.0.0.1:8080/servers/deleteServer?id=' + id).then((response) => {
      this.setState({serverId: '', delServerModal: false});
      console.log(response.status);
      if (response.data == "Server deleted successfully!") {
        this.__refreshServersCollection();
        toast.success(response.data);
      } else {
        toast.error(response.data);
      }
    });
  }
  findServerById(id) {
    if (id == '') {
      this.setState({serverId: '', findServerByIdModal: false});
      this.__refreshServersCollection();
      return;
    }
    axios.get('http://127.0.0.1:8080/servers/getServer?id=' + id).then((response) => {
      this.setState({serverId: '', findServerByIdModal: false});
      this.setState({
        servers: [response.data]
      });
    }).catch(error => {
      toast.error("Server not found!");
  });
  }
  findServerByName(name) {
    if (name == '') {
      this.setState({serverName: '', findServerByNameModal: false});
      this.__refreshServersCollection();
      return;
    }
    axios.get('http://127.0.0.1:8080/servers/getServer?name=' + name).then((response) => {
      this.setState({serverName: '', findServerByNameModal: false});
      this.setState({
        servers: response.data
      });
    }).catch(error => {
      toast.error("Server not found!");
  });
  }
  render() {
    let servers = this.state.servers.map((server) => {
      return (
        
        <tr  key={server.id}>
      
          <td>{server.id}</td>
          <td>{server.name}</td>
          <td>{server.language}</td>
          <td>{server.framework}</td>
           <td>
             <Button color="danger" size="sm" onClick={this.deleteServer.bind(this, server.id)}>DELETE</Button>
           </td> 
          
        </tr> 
        
      )
    });
    return (
      <div className="App container">
        
        <Table className='table'>
          <thead>
            <tr>
              <th>
                <Button className="my-3" size="sm" color="success" onClick={this.toggleNewServerModal.bind(this)}>Create Server</Button>
              </th>
              <th>
               <Button className="my-3" size="sm" color="primary" onClick={this.toggleFindServerByIdModal.bind(this)}>Find By Id</Button>
              </th>
              
              <th>
               <Button className="my-3" size="sm" color="danger" onClick={this.toggleDelServerModal.bind(this)}>Delete By Id</Button>
              </th>
            </tr>
          </thead>
        </Table>
        <Modal isOpen={this.state.newServerModal} toggle={this.toggleNewServerModal.bind(this)}>
        <div class="green-styling">
          <ModalHeader toggle={this.toggleNewServerModal.bind(this)}>Create Server</ModalHeader>
          <ModalBody >
            
           <FormGroup >
              <Label for="id">ID</Label>
              <Input type="text" id="id"  value={this.state.newServerObject.id} onChange={(e) =>{
                let {newServerObject} = this.state;
                newServerObject.id = e.target.value;
                this.setState({newServerObject});
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" id="name"  value={this.state.newServerObject.name} onChange={(e) =>{
                let {newServerObject} = this.state;
                newServerObject.name = e.target.value;
                this.setState({newServerObject});
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="language">Language</Label>
              <Input type="text" id="language"  value={this.state.newServerObject.language} onChange={(e) =>{
                let {newServerObject} = this.state;
                newServerObject.language = e.target.value;
                this.setState({newServerObject});
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="framework">Framework</Label>
              <Input type="text" id="framework"  value={this.state.newServerObject.framework} onChange={(e) =>{
                let {newServerObject} = this.state;
                newServerObject.framework = e.target.value;
                this.setState({newServerObject});
              }} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.createServer.bind(this)}>Create</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewServerModal.bind(this)}>Cancel</Button>
          </ModalFooter>
          </div>
        </Modal>
        <Modal isOpen={this.state.findServerByIdModal} toggle={this.toggleFindServerByIdModal.bind(this)}>
          <div className='primary'>
          <ModalHeader toggle={this.toggleFindServerByIdModal.bind(this)}>Find server by ID</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="id">ID</Label>
              <Input type="text"  value={this.state.serverId} onChange={this.handleChangeId.bind(this)} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.findServerById.bind(this, this.state.serverId)}>Find</Button>{' '}
            <Button color="secondary" onClick={this.toggleFindServerByIdModal.bind(this)}>Cancel</Button>
          </ModalFooter>
          </div>
        </Modal>
      
        <Modal isOpen={this.state.delServerModal} toggle={this.toggleDelServerModal.bind(this)}>
        <div className='danger'>
          <ModalHeader toggle={this.toggleDelServerModal.bind(this)}>Delete Server By Id</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="id">ID</Label>
              <Input type="text"  value={this.state.serverId} onChange={this.handleChangeId.bind(this)} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.deleteServer.bind(this, this.state.serverId)}>Delete</Button>{' '}
            <Button color="secondary" onClick={this.toggleDelServerModal.bind(this)}>Cancel</Button>
          </ModalFooter>
          </div>
        </Modal>
        <Table bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Language</th>
              <th>Framework</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {servers} 
          </tbody>
        </Table>
        
      </div>
    );
  }
}

export default App;
