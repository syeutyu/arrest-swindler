import got from "got";
import task from "tasuku";
import inquirer from "inquirer";

import { renderWarningCount } from "./render";

enum SearchType {
  Phone = "H",
  Account = "A"
}

function delay(sec: number) {
  return new Promise((res) => {
    setTimeout(res, sec);
  });
}

async function main() {
  const types = Object.keys(SearchType);

  const { userInput } = await inquirer.prompt([
    {
      type: "list",
      name: "userInput",
      message: "어떤 유형으로 검색하시나요?",
      choices: types,
    },
  ]);

  const searchType = userInput === "Phone" ? SearchType.Phone : SearchType.Account;

  const { phone, account } = await inquirer.prompt([
    {
      type: "input",
      name: "phone",
      message: "전화번호를 입력해주세요 ex) 01012341234",
      when: searchType === SearchType.Phone,
      validate: function (input: string) {
        const isValidPhoneNumber = /^\d{10,11}$/g.test(input);
        if (!isValidPhoneNumber) {
          console.log("\n\n📱 올바른 전화번호를 입력해주세요 😭");
          process.exit(1);
        }

        return true;
      },
    },
    {
      type: "input",
      name: "account",
      message: "-없이 계좌번호를 입력해주세요 ex) 30200000000",
      when: searchType === SearchType.Account,
      validate: function (input: string) {
        const isValidAccountNumber =  /^[0-9]+$/g.test(input);
        if (!isValidAccountNumber) {
          console.log("\n\n🏦 올바른 계좌번호를 입력해주세요 😭");
          process.exit(1);
        }

        return true;
      },
    },
    ]);

  const input = phone || account;

  await task(`🔍 더치트와 경찰청에 ${input}을 검색중입니다...`, async ({ setTitle }) => {
    await delay(1000);

    const baseURL = "https://api.joongna.com/v2/fraud?entryType=2";

    const { data: { theCheat, cyberCop } } = await got.get(baseURL, {
      searchParams: {
        keyword: input,
        type: searchType,
      },
    }).json();

    console.log("\n\n");
    console.log([
      renderWarningCount("더치트", theCheat.count),
      renderWarningCount("경찰청", cyberCop.count),
    ].join("\n----------------------\n"));
    console.log("\n\n");

    setTitle("조회가 끝났습니다.");
  });
}

main();
