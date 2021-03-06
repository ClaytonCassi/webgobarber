import React, { useCallback, useRef } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg'
import { FiLogIn, FiMail, FiLock } from  'react-icons/fi';
import { Form } from '@unform/web'
import * as Yup from 'yup';
import { Link } from 'react-router-dom'
import {useAuth} from '../../hooks/Auth'
import { useToast } from '../../hooks/Toast'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData {
  email: string;
  password: string;
}


const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  
 
  const {  SignIn } = useAuth();

  const { addToast } = useToast();
  

  const  handleSubmit = useCallback( async (data: SignInFormData) => { 
    try {
     formRef.current?.setErrors({});
     const schema = Yup.object().shape({
       email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
       password: Yup.string().required('Senha obrigatória'),
     })
     await schema.validate(data, {
       abortEarly: false,
     });

    await SignIn({
       email : data.email,
       password : data.password
     });

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
  }, [SignIn, addToast]);

  return (
<>
<Container> 
  <Content>
    <AnimationContainer>
    <img src={logoImg} alt="GoBarber" />
    <Form ref={formRef} onSubmit={handleSubmit}>
    <h1> Faça seu logon</h1>
    <Input name="email" icon={FiMail} placeholder='E-mail' />
    <Input name="password" icon={FiLock}  type='password' placeholder='Senha' />
    <Button type='submit'>Entrar </Button>
    <a href="forgot">Esqueci minha senha</a> 

    </Form>
    <Link to="/signup">
    <FiLogIn />
    Criar Conta
    </Link> 
    
    </AnimationContainer>
  </Content>
  <Background /> 

</Container>
</>
);
}
export default SignIn;