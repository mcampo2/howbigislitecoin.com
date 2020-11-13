#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path')

// root directory of Litecoin data
const FOLDER = '~/.litecoin';
var folder = FOLDER;
if(folder.indexOf('~')!=-1)
    folder = folder.replace('~', os.homedir());

// passes reading to readFile() or readDirectory()
function read(file) {
    stats = fs.statSync(file);
    if(stats.isDirectory()) return readDirectory(file);
    else if(stats.isFile()) return readFile(file);
    else return readOther(file);
}

// passes directory contents to read()
 function readDirectory(file) {
    var data = {'name': file.replace(/^.*[\\\/]/, ''), 'children': []};
    files = fs.readdirSync(file);
    files.forEach((item, index) => {
        data['children'].push(read(path.join(file, item)));
    });
    data['size'] = readSize(data['children']);
    return data;
}

// reads a file
function readFile(file) {
    var data = {'name': file.replace(/^.*[\\\/]/, '')};
    stats = fs.statSync(file);
    data['size'] = stats.size;
    return data;
}

// determines the recursive size of a directory
function readSize(children) {
    var size = 0;
    children.forEach((item, index) => {
        if(item['children'] != null) size += readSize(item['children']);
        else size += item['size'];
    });
    return size;
}

// reads a file that is neither a directory or a file
function readOther(file) {
    return {'name': file.replace(/^.*[\\\/]/, ''), 'size': 0};
}

data = read(folder)
fs.writeFileSync('data.json', JSON.stringify(data))