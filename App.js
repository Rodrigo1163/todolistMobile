import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import Tarefa from './src/Tarefa';

export default function App() {
  

  const [tarefa, setTarefa] = useState('');
  const [list, setList] = useState([])

  async function handleAdd(){
    
    if(tarefa === '') {
      return
    }
    const dados = {
      key: Date.now(),
      item: tarefa
    }

    try {
      const updatedTask = [...list, dados];
      setList(updatedTask)
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTask));
      setTarefa('');
      
      

    } catch(err) {
      console.log(err);
    }

  }
  useEffect(() => {
    async function carregarItem() {
      try {
        const value = await AsyncStorage.getItem('tasks');
        console.log(value)

        if(value !== null) {
          setList(JSON.parse(value));
          // console.log(value)
        }
      } catch(err) {
        console.log(err)
      }

    }
    carregarItem()
  }, [])
  

  async function handleDelete(item){
    try {
      let filtroItem = list.filter((tarefa) => {
        return (tarefa.key !== item)
      })
      await AsyncStorage.setItem('tasks', JSON.stringify(filtroItem))
      setList(filtroItem);
    } catch(err) {
      console.log(err)
    }
    // let filtroItem = list.filter((tarefa) => {
    //   return (tarefa.item !== item)
    // })

    // setList(filtroItem)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas</Text>
      
      <View style={styles.containerInput}>
        <TextInput 
          placeholder="Digite sua tarefa..."
          style={styles.input}
          value={tarefa}
          onChangeText={setTarefa}
        />
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <FontAwesome name='plus' size={20} color='#FFF'/>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={list}
        keyExtractor={ (item, index) => index.toString()}
        renderItem={ ({ item }) => <Tarefa data={item} deleteItem={() => handleDelete(item.key)}/>}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22272e',
    paddingTop: 28
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
    marginTop: '5%',
    paddingStart: '5%',
    marginBottom: 12
  },
  containerInput: {
    flexDirection: 'row',
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22
  },
  input: {
    width: '75%',
    backgroundColor: '#FBFBFB',
    height: 44,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  buttonAdd: {
    width: '15%',
    height: 44,
    backgroundColor: '#73f7ff',
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  list: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingStart: '4%',
    paddingEnd: '4%'
  }
});
