
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const adminToken = process.env.ADMIN_TOKEN;
const clientToken = process.env.CLIENT_TOKEN;


// Создание экземпляров ботов
const adminBot = new TelegramBot(adminToken);
const clientBot = new TelegramBot(clientToken, { polling: true });

// Обработка команды /start у клиентского бота
clientBot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = 'Выберите одну из трех позиций:\n\n' +
                  '1. Purple Joy 5 400gel\n' +
                  '2. Purple Joy 10 750gel\n' +
                  '3. WW Auto 10 700gel\n\n' +
                  'Отправьте свой выбор и комментарий в формате:\n' +
                  'Выбор: <номер позиции>\n' +
                  'Комментарий: <ваш комментарий, пожелания>\n'  +
                  'Для перезапуска бота снова напишите команду /start';
  clientBot.sendMessage(chatId, message);
});

// Обработка сообщения от клиентского бота
clientBot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;

  // Проверка формата сообщения
  const regex = /Выбор:\s*(\d+)\s*\nКомментарий:\s*(.+)/;
  const match = messageText.match(regex);
  if (!match) {
    clientBot.sendMessage(chatId, 'Неправильный формат сообщения. Пожалуйста, используйте формат:\n' +
                                   'Выбор: <номер позиции>\n' +
                                   'Комментарий: <ваш комментарий>');
    return;
  }

  // Получение выбора и комментария
  const choice = parseInt(match[1]);
  const comment = match[2];

  // Отправка сообщения администратору
  const adminMessage = `Новый выбор от пользователя с ID ${userId}:\n\n` +
                       `Выбор: ${choice}\n` +
                       `Комментарий: ${comment}`;
  adminBot.sendMessage(chatId, adminMessage);
});

// Обработка сообщения от администратора
adminBot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Пересылка сообщения от администратора клиенту
  clientBot.sendMessage(chatId, messageText);
});

// Запуск клиентского бота
clientBot.on('polling_error', (error) => {
  console.log(`Client Bot polling error: ${error}`);
});
console.log('Client Bot is running...');

// Запуск администраторского бота
adminBot.on('polling_error', (error) => {
  console.log(`Admin Bot polling error: ${error}`);
});
console.log('Admin Bot is running...');
