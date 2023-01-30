const lyrics = [
    '正在点咖啡',
    '正在制作卡布奇诺',
    '正在拉花',
    'Make LAE great again!',
    '正在制作拿铁',
    '正在制作摩卡',
    '正在回忆童年',


    // 哈哈
    '!!我为什么会在加载条下面!!',
]


// 导出函数
export default function () {
    // 随机 lyrics 中的内容，如果没有就返回 ''
    return lyrics[Math.floor(Math.random() * lyrics.length)] || ''
}