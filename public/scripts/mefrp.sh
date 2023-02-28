#!/bin/bash

check_root() {
    if [ $EUID -ne 0 ]; then
        echo "请使用 root 权限运行"
        # exit 1
    fi
    
}

install_frpc() {
    # 获取 CPU 架构
    arch=$(uname -m)
    
    # 获取内核
    kernel=$(uname -s)
    # kernel 转换为小写
    # shellcheck disable=SC2021
    kernel=$(echo "$kernel" | tr '[A-Z]' '[a-z]')
    
    # if arch is x86_64, then arch is amd64
    if [ "$arch" == "x86_64" ]; then
        arch="amd64"
    fi
    
    
    file_name="frp_MirrorEdgeFrp_0.46.1_beta_${kernel}_$arch"
    
    link="https://r2.laecloud.com/MEFrpRelease/$file_name.tar.gz"
    
    # 下载 frp
    wget -O /tmp/frp.tar.gz "$link"
    
    # 解压 frp，解压后的文件夹名字是 frpc
    tar -zxvf /tmp/frp.tar.gz -C /tmp
    
    # 将 frpc 复制到 /usr/bin/frpc
    cp /tmp/"$file_name"/frpc /usr/bin/frpc
    # cp /tmp/$file_name/frpc ./frpc
    
    rm -rf /tmp/"$file_name"
}

check_root

# 检测 /usr/bin/frpc 是否存在
if [ ! -f /usr/bin/frpc ]; then
    echo "frpc 未安装"
    install_frpc
fi

# 获取参数
token=$1
id=$2

# 检测参数是否为空
if [ -z "$token" ] || [ -z "$id" ]; then
    echo "参数错误"
    exit 1
fi

# 将 token 放到 /etc/laecloud/token 文件中

if [ ! -d /etc/laecloud ]; then
    mkdir /etc/laecloud
fi

echo "$token" > /etc/laecloud/token

# systemd
cat > /etc/systemd/system/frpc@.service << EOF
[Unit]
Description=LAE Frp Client Service of %i
After=network.target


[Service]
Type=simple
User=nobody
Restart=on-failure
RestartSec=5s
ExecStart=/bin/bash -c '/usr/bin/frpc -t \"$(cat /etc/laecloud/token)\" -i %i'
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now frpc@"$id"

echo "安装完成，如果需要停止这一条隧道，请运行："
echo "systemctl disable --now frpc@$id"