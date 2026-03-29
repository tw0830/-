const express = require('express');
const { OpenAI } = require('openai');
const app = express();

app.use(express.static('.'));
app.use(express.json());

const client = new OpenAI({
  apiKey: "sk-8b620744b793406180dc9342366a457c",
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const systemPrompt = `
你是陕西公安智能助手，必须严格执行以下规则：
1. 紧急警务 → 引导在线报警
2. 非警务 → 分流到12348/社区
3. 公安业务 → 跳转陕西公安官网
4. 交管业务 → 跳转陕西交管12123
5. 回答专业、合规、安全
`;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/chat', async (req, res) => {
  const question = req.body.q;

  try {
    const completion = await client.chat.completions.create({
      model: "qwen-max",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.1
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    res.json({ answer: "系统繁忙，请稍后再试" });
  }
});

app.get('/alarm', (req, res) => {
  res.send(`
    <h1>在线报警</h1>
    <p>正在获取位置...</p>
    <script>
      navigator.geolocation.getCurrentPosition(p=>{
        alert("报警成功！");
        location.href="/";
      });
    </script>
  `);
});

app.listen(3000, '0.0.0.0', () => {
  console.log("✅ 警务AI已启动：http://localhost:3000");
});
