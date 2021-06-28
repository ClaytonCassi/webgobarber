import React, { useCallback, useRef } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiArrowLeft, FiMail, FiLock, FiUser } from  'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles} from '@unform/core'
import * as Yup from 'yup';
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors';
import {Link, useHistory} from 'react-router-dom'
import {useToast} from '../../hooks/Toast'
import Input from '../../components/Input'
import Button from '../../components/Button'

interface signUpFormData {
  nome: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history  = useHistory();
  const  handleSubmit = useCallback( async (data: signUpFormData) => { //eslint-disable-line
   try {

     formRef.current?.setErrors({});
     const schema = Yup.object().shape({
       name: Yup.string().required('Nome obrigatório'),
       email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
       password: Yup.string().min(6, 'No minimo 6 dígitos'),
     })
     await schema.validate(data, {
       abortEarly: false,
     });

      await api.post('/users', data);
      history.push('/');
      
      addToast({
        type: 'success',
        title: 'Cadastro realizado com sucesso!',
        description: 'Você já pode realizar seu logon'
      })
   }catch (err) {
    if (err instanceof Yup.ValidationError) {
      const errors = getValidationErrors(err);

      formRef.current?.setErrors(errors);
      return;
   }

   addToast({
     type: 'error',
     title: 'erro na autenticacao',
     description: 'Ocorreu um erro ao realizar o login',
   });
   }
  }, [addToast, history]);

return (
  <>
<Container> 
<Background /> 
  <Content>
  <AnimationContainer>
<img src={logoImg} alt="GoBarber" />
<Form ref={formRef} onSubmit={handleSubmit}>
    <h1> Faça seu cadastro</h1>
    <Input name="name" icon={FiUser} placeholder='Nome' />
    <Input name="email" icon={FiMail} placeholder='E-mail' />
    <Input name="password" icon={FiLock}  type='password' placeholder='Senha' />
    <Button type='submit'>Cadastrar </Button>
   

    </Form>
    <Link to="/">
    <FiArrowLeft />
   Voltar para logon
    </Link>
    
    </AnimationContainer>
  </Content>
  
  
</Container>
</>
)
}

export default SignUp;