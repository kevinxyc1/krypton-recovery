import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Button, Alert, Popconfirm, Form, Input, Radio } from "antd";
import PhraseBox from "../components/PhraseBox";
import { useGlobalState } from "../context";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

// Import Bip39 to generate a phrase and convert it to a seed:
import * as Bip39 from "bip39";
import { Keypair, PublicKey } from "@solana/web3.js";
import Paragraph from "antd/lib/skeleton/Paragraph";
import { Box } from "../styles/StyledComponents.styles";
import form from "antd/lib/form";
// Import the Keypair class from Solana's web3.js library:

const guard1_sk = new Uint8Array([
  219, 192, 245, 18, 33, 148, 209, 236, 79, 88, 130, 250, 118, 164, 109, 172,
  44, 165, 195, 136, 163, 187, 142, 184, 86, 208, 221, 3, 162, 127, 89, 82, 164,
  161, 91, 84, 42, 199, 40, 204, 137, 172, 179, 152, 212, 17, 58, 31, 149, 133,
  67, 96, 23, 111, 83, 3, 119, 19, 37, 234, 163, 216, 53, 177,
]);

const guard2_sk = new Uint8Array([
  16, 5, 214, 175, 105, 238, 18, 14, 125, 4, 242, 215, 158, 179, 200, 230, 230,
  16, 36, 227, 200, 142, 130, 53, 235, 159, 100, 69, 177, 36, 239, 113, 42, 210,
  117, 85, 113, 159, 206, 119, 128, 70, 103, 49, 182, 66, 56, 157, 83, 23, 35,
  230, 206, 33, 216, 246, 225, 4, 210, 157, 161, 122, 142, 66,
]);

const guard3_sk = new Uint8Array([
  94, 98, 75, 17, 140, 107, 60, 66, 202, 114, 237, 8, 118, 129, 7, 68, 173, 6,
  106, 131, 118, 72, 208, 174, 113, 231, 127, 154, 50, 191, 223, 209, 194, 4,
  95, 55, 179, 216, 90, 90, 229, 27, 131, 112, 116, 110, 129, 176, 218, 139,
  146, 221, 75, 148, 197, 54, 113, 159, 226, 239, 52, 43, 19, 81,
]);

const feePayer_sk = new Uint8Array([
  106, 239, 158, 103, 197, 210, 91, 64, 112, 50, 190, 210, 69, 58, 113, 130,
  168, 199, 156, 103, 186, 170, 85, 248, 149, 123, 203, 109, 98, 129, 140, 45,
  131, 193, 148, 111, 29, 124, 161, 112, 165, 212, 174, 108, 106, 188, 96, 114,
  158, 16, 122, 70, 49, 145, 128, 123, 155, 213, 214, 67, 186, 75, 46, 174,
]);

const Signup: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const { setAccount, mnemonic, setMnemonic, setGuardians, guardians } =
    useGlobalState();

  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    // const guard1 = Keypair.fromSecretKey(guard1_sk);
    // const guard2 = Keypair.fromSecretKey(guard2_sk);
    // const guard3 = Keypair.fromSecretKey(guard3_sk);
    const feePayer = Keypair.fromSecretKey(feePayer_sk);

    // This line sets the account to context state so it can be used by the app
    // setGuardians([guard1.publicKey, guard2.publicKey, guard3.publicKey]);
    setAccount(feePayer);
  }, []);

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = () => {
    form.submit()
    setLoading(true);
    router.push("/wallet");
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    console.log(values)
    setGuardians([new PublicKey(values.guardian1), new PublicKey(values.guardian2), new PublicKey(values.guardian3)])
  }

  return (
    <>
      <h1 className={"title"}>Guardian Initialization</h1>

      <p>Add 3 guardians to enable social recovery of your wallet</p>

      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: "ff" }}
        onFinish={onFinish}
      >
        <Form.Item
          name="guardian1"
          label="Guardian 1 Public Key"
          rules={[
            {
              required: true,
              message: "Please input the public key of guardian",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="guardian2"
          label="Guardian 2 Public Key"
          rules={[
            {
              required: true,
              message: "Please input the public key of guardian",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="guardian3"
          label="Guardian 3 Public Key"
          rules={[
            {
              required: true,
              message: "Please input the public key of guardian",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
            name="modifier"
            className="collection-create-form_last-form-item"
          >
            <Radio.Group>
              <Radio value="ff">Friend / Family</Radio>
              <Radio value="hardware">Hardware</Radio>
            </Radio.Group>
          </Form.Item> */}
      </Form>

      {!loading && (
        <Popconfirm
          title="Do you confirm your signup"
          visible={visible}
          onConfirm={handleOk}
          okButtonProps={{ loading: loading }}
          onCancel={handleCancel}
          cancelText={"No"}
          okText={"Yes"}
        >
          <Button type="primary" onClick={showPopconfirm}>
            Finish
          </Button>
        </Popconfirm>
      )}

      {loading && <LoadingOutlined style={{ fontSize: 24 }} spin />}
    </>
  );
};

export default Signup;
