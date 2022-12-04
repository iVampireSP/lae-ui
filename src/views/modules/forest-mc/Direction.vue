<template>
  <div>{{ topic }}</div>
</template>

<script setup>
  import { client, baseTopic } from '../../../plugins/mqtt'

  let topic = baseTopic + '/mc'

  console.log(topic)

  client.subscribe(topic)

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(topic)
    console.log(message.toString())
    // mqtt.end()
  })
</script>
