# Tree JSON
ディレクトリ構造など，特定のJSONオブジェクトを階層を明示して書くためのフォーマット．

```tjson
 | folder1   
 | | folder2
 | | |-file1
 | |-file2
 | folder3
 ```

は以下のJSONオブジェクトに変換される．
```json
{   
    "hasChild":true,
    "value":"root_directory",
    "child":[
        {
            "hasChild":true,
            "value":"folder1",
            "child":[
            {
                "hasChild":true,
                "value":"folder2",
                "child":[
                    {
                        "hasChild":false,
                        "value":"file1"
                    }]
            },
            {
                "hasChild":false,
                "value":"file2"
            }]
        },
        {
            "hasChild":true,
            "value":"folder3",
            "child":[]
        }]
}
```

# 仕様
## 階層の指定
縦棒"｜"の数によってどの階層にいるかを指定する．現状の仕様では，最低でも縦棒は1本必要である．

階層を深くする場合は現在の階層から1段のみとする．（自然なディレクトリ構造）

## フォルダかファイルかの指定
ハイフン"-"をつけると子要素を持たないファイルオブジェクト，つけなければ
子要素を持つフォルダオブジェクトとなる．

## 改行
parserが行ごとに読み込む処理をしているため，1行に複数オブジェクトを含めることはできない．（例：| Folder |-file1）

## 空白の扱い
空白はファイル名の途中を除いて無視されるため，
```
| Folder1
| |-file1
```
と
```
|Folder1
||-file1
```
は等価である．
可読性のため，前者の表記を基本とする．

文字列の前後の空白はトリムされるが，内部はトリムされないため「ファイル　１」のような名前をつけることも可能である．

