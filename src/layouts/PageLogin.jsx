
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React from 'react';



const PageLogin = () => {

   const onHandleSubmit = data => {
      // setLoading(true);
      // axios.post(`http://localhost:5000/users`, data)
      //    .then(res => {
      //       setLoading(false);
      //       message.success('User Added Successfully!');
      //       history.push('/list');
      //    })
      //    .catch(error => {
      //       setLoading(false);
      //       message.error(error);
      //    });
   };

   // https://medium.com/wesionary-team/how-to-implement-ant-design-with-react-7d21b6e261cc
   return (
      <div>
         <Form
            className='login-form'
            style={{
               width: '500px',
               labelCol: { span: 8 },
               wrapperCol: { span: 16 },
            }}
            onFinish={onHandleSubmit}
         >

            <Form.Item style={{ textAlign: 'center' }}>
               <img src='/img/logo.png' alt='Woh Hup' />
            </Form.Item>

            <Form.Item
               name='Email'
               rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please input a valid email!' },
               ]}
            >
               <Input
                  size='large'
                  placeholder='Email'
                  prefix={<UserOutlined />}
                  autoComplete='off'
               />
            </Form.Item>

            <Form.Item
               name='Password'
               rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be minimum 6 characters.' }
               ]}
            >
               <Input.Password
                  size='large'
                  placeholder='Password'
                  prefix={<LockOutlined />}
                  iconRender={visible => ''}
               />
            </Form.Item>

            <Form.Item style={{ wrapperCol: { offset: 8, span: 16 } }}>
               <Button type='primary' htmlType='submit'>Submit</Button>
            </Form.Item>

         </Form>
      </div>
   );
};

export default PageLogin;
