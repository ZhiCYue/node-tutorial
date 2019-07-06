## TLS 服务

Node 在底层是通过 openssl 实现 TLS/SSL 的，为此要生成公钥私钥可以通过 openssl 完成。

分别为客户端、服务器端生成私钥，如下所示：
```bash
// 生成服务器端私钥
$ openssl genrsa -out server.key 1024
// 生成客户端私钥
$ openssl genrsa -out client.key 1024
```

再通过各自的私钥生成公钥：

```bash
$ openssl rsa -in server.key -pubout -out server.pem
$ openssl rsa -in client.key -pubout -out client.pem
```

虽然有了公钥私钥，但客户端、服务器端之间可能存在”中间人“伪造公钥和私钥，为了解决这个问题，TLS/SSL 引入了数字证书来进行认证。

数字证书包含了服务器的名称和主机名、服务器的公钥、签名颁发机构的名称、来自签名颁发机构的签名。在建立连接前，会通过证书中的签名来确认收到的公钥是来自目标服务器的。从而建立信任关系。

#### 数字证书

为了保证数据安全，需要引入一个第三方：CA（数字证书认证中心）。其作用是为站点颁发证书，且这个证书中具有CA 通过自己的公钥和私钥实现的签名。

为了得到证书，服务器端需要通过自己的私钥生成CSR （证书签名请求）文件。CA 机构通过这个文件来颁发属于该服务器的签名证书，只要通过CA 机构就能验证证书是否合法。

自签名证书，指服务器端自己充当CA 角色。以下是生成私钥、生成CSR 文件、通过私钥自签名生成证书的过程：

```
$ openssl genrsa -out ca.key 1024
$ openssl req -new -key ca.key -out ca.csr
$ openssl x509 -req -in ca.csr -signkey ca.key -out ca.crt
```

上述步骤完成了扮演CA 角色需要的文件。服务器端需要向CA机构申请签名证书。在申请签名证书之前依然是创建自己的CSR文件。注意，这个过程中的common name 要匹配服务器域名，否则后续认证过程会失败。如下是生成CSR文件所需要的命令：

```
$ openssl req -new -key server.key -out server.csr
```

得到 CSR 文件后，向自己的 CA 机构申请签名。签名过程中需要 CA 的证书和私钥参与，最终会颁发一个带有 CA 签名的证书，如下：

```
$ openssl x509 -req -CA ca.crt -CAkey ca.key -CAcreateserial -in server.csr -out server.crt
```

客户端在发起安全连接前会去获取服务器端的证书，并通过CA的证书验证服务器端证书的真伪。除了验证真伪外，通常还会含有对服务器名称、IP地址等验证的过程。


CA 机构将证书颁发给服务器后，证书在请求的过程中会被发送给客户端，客户端需要通过 CA 的证书验证真伪。 


#### TLS 服务端

见server/server.js

在启动服务后，可以通过下面命令测试证书是否正常

```
$ openssl s_client -connect 127.0.0.1:8000
```

#### TLS 客户端

在构建客户端之前，需要为客户端生成属于自己的私钥和签名，代码如下：

```
// 创建私钥
$ openssl genrsa -out client.key 1024
// 生成CSR
$ openssl req -new -key client.key -out client.csr
// 生成签名证书
$ openssl x509 -req -CA ca.crt -CAkey ca.key -CAcreateserial -in client.csr -out client.crt
```


下面是摘自网络的自签名描述：

Self-signed certificates
When using a self-signed certificate, there is no chain of trust. The certificate has signed itself. The web browser will then issue a warning, telling you that the web site certificate cannot be verified. Therefore, you should not use self-signed certificates for professional use, as your visitors will not trust your web site to be safe.